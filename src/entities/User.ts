/* eslint-disable import/no-unresolved */
import {
  IsEmail, Length,
} from 'class-validator';
import {
  Entity as ToEntity,
  Column, Index,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
// eslint-disable-next-line import/extensions
import Entity from './Entity';
// eslint-disable-next-line import/extensions
import Post from './Post';
import Vote from './Vote';

@ToEntity('users')
class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

    @IsEmail(undefined, { message: 'Must be a valid Email address' })
    @Length(1, 255, { message: 'Email is empty' })
    @Column({ unique: true })
    email: string

    @Index()
    @Length(4, 255, { message: 'Must be at least 4 characters long' })
    @Column({ unique: true })
    username: string

    @Exclude()
    @Column()
    @Length(6, 255, { message: 'Must be at least 6 characters long' })
    password: string

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 6);
    }

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[]
}

export default User;
