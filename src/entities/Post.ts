/* eslint-disable import/no-unresolved */
import { Exclude, Expose } from 'class-transformer';
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
import Vote from './Vote';

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

  @Column()
  username: string

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((pre, cur) => pre + (cur.value || 0), 0)
  }

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[]

  protected userVote: number
  setUserVote(user: User) {
    const index = this.votes?.findIndex(v => v.username === user.username)
    this.userVote = index > -1 ? this.votes[index].value: 0
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
