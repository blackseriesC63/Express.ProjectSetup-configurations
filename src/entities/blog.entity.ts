import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: "authorId" })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @Column()
  authorId: number;

  @Column({ type: "int", default: 0 })
  likes: number;
}
