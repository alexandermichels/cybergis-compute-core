import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Job } from "./Job";

/** Class representing a job log. */
@Entity({ name: "logs" })
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: string;

  @Column("text")
  message: string;

  @ManyToOne((type) => Job, (job: Job) => job.logs)
  job: Job;

  @Column({
    type: "bigint",
    transformer: {
      to: (i: Date | null | undefined): number => (i ? i.getTime() : null),
      from: (i: number | null | undefined): Date => (i ? new Date(Math.trunc(i)) : null),
    },
  })
  createdAt: Date;

  @Column({
    type: "bigint",
    nullable: true,
    transformer: {
      to: (i: Date | null | undefined): number => (i ? i.getTime() : null),
      from: (i: number | null | undefined): Date => (i ? new Date(Math.trunc(i)) : null),
    },
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "bigint",
    nullable: true,
    transformer: {
      to: (i: Date | null | undefined): number => (i ? i.getTime() : null),
      from: (i: number | null | undefined): Date => (i ? new Date(Math.trunc(i)) : null),
    },
  })
  deletedAt: Date;

  /**
   * Set the createdAt time to the current time.
   *
   * @async
   * @return {Date} date - Date this job was created.
   */
  @BeforeInsert()
  async setCreatedAt() {
    this.createdAt = new Date();
  }

  /**
   * Set the updatedAt time to the current time.
   *
   * @async
   * @return {Date} date - Date this job was last updated.
   */
  @BeforeUpdate()
  async setUpdatedAt() {
    return (this.updatedAt = new Date());
  }
}
