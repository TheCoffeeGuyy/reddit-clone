/* eslint-disable import/no-unresolved */
import {
  Entity as ToEntity,
  Column, Index, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
// eslint-disable-next-line import/extensions
import { makeId, slugify } from '../utils/helpers';
// eslint-disable-next-line import/extensions
import Entity from './Entity';
// eslint-disable-next-line import/extensions
import Post from './Post';
// eslint-disable-next-line import/extensions
import User from './User';

    @ToEntity('subs')
export default class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Column({ unique: true })
  name: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  imageUrn: string

  @Column({ nullable: true })
  bannerUrn: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[]
}
