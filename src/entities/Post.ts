/* eslint-disable import/no-unresolved */
import {
  Entity as ToEntity,
  Column, Index, ManyToOne, JoinColumn, BeforeInsert, OneToMany,
} from 'typeorm';
// eslint-disable-next-line import/extensions
import { makeId, slugify } from '../utils/helpers';
import Comment from './Comment';
// eslint-disable-next-line import/extensions
import Entity from './Entity';
// eslint-disable-next-line import/extensions
import Sub from './Sub';
// eslint-disable-next-line import/extensions
import User from './User';

  @ToEntity('posts')
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string

  @Column()
  title: string

  @Index()
  @Column()
  slug: string

  @Column({ nullable: true, type: 'text' })
  body: string

  @Column()
  subName: string

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
