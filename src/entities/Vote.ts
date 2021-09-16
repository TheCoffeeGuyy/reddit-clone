/* eslint-disable import/no-unresolved */
import {
  Entity as ToEntity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Comment from './Comment';
// eslint-disable-next-line import/extensions
import Entity from './Entity';
// eslint-disable-next-line import/extensions
import Post from './Post';
import User from './User';

@ToEntity('votes')
class Vote extends Entity {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @Column()
  username: string

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  comment: Comment;
}

export default Vote;
