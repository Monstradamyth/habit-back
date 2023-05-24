import { Repository, UpdateResult } from "typeorm";
import { CourseRepository } from "../../db";
import { CourseEntity } from "./entity";
import { CreateCourseDTO, UpdateCourseDTO } from "./models";
import { AttemptStatus, attemptService } from "../attempt/service";
import { taskService } from "../task/service";

interface ICourseServiceGet {
  getAllCourses(): Promise<CourseEntity[]>;
  getCourseById(id: CourseEntity["id"]): Promise<CourseEntity | null>;
  getCoursesByHabitId(
    habitId: CourseEntity["habit"]["id"]
  ): Promise<CourseEntity[]>;
  getActiveAndPendingCourses(
    habitId: CourseEntity["habit"]["id"]
  ): Promise<CourseEntity[]>;
}

interface ICourseServiceCreate {
  createCourse(course: CreateCourseDTO): Promise<CourseEntity>;
}

interface ICourseServiceUpdate {
  updateCourse(
    id: CourseEntity["id"],
    course: UpdateCourseDTO
  ): Promise<UpdateResult>;
}

interface ICourseServiceDelete {
  deleteCourse(id: CourseEntity["id"]): Promise<void>;
}

interface ICourseServiceActions {
  startCourse(courseId: CourseEntity["id"]): Promise<UpdateResult>;
  failCourse(courseId: CourseEntity["id"]): Promise<UpdateResult>;
  successCourse(courseId: CourseEntity["id"]): Promise<UpdateResult>;
  finishCourse(courseId: CourseEntity["id"]): Promise<UpdateResult>;
}

export interface ICourseService
  extends ICourseServiceGet,
    ICourseServiceCreate,
    ICourseServiceUpdate,
    ICourseServiceDelete,
    ICourseServiceActions {}

export enum courseStatuses {
  "PENDING" = "pending",
  "ACTIVE" = "active",
  "FINISHED" = "finished",
  "FAILED" = "failed",
}

class CourseService implements ICourseService {
  constructor(private courseRepository: Repository<CourseEntity>) {}

  private defaultRelations = {
    relations: {
      tasks: true,
    },
  };

  // GET
  async getAllCourses(): Promise<CourseEntity[]> {
    return this.courseRepository.find();
  }

  async getActiveAndPendingCourses(
    habitId: CourseEntity["habit"]["id"]
  ): Promise<CourseEntity[]> {
    return this.courseRepository.find({
      where: [
        {
          habit: {
            id: habitId,
          },
          status: courseStatuses.ACTIVE,
        },
        {
          habit: {
            id: habitId,
          },
          status: courseStatuses.PENDING,
        },
      ],
      ...this.defaultRelations,
    });
  }

  async getCourseById(id: CourseEntity["id"]): Promise<CourseEntity | null> {
    if (!id) return null;
    return this.courseRepository.findOne({
      where: { id },
      ...this.defaultRelations,
    });
  }

  async getCoursesByHabitId(
    habitId: CourseEntity["habit"]["id"]
  ): Promise<CourseEntity[]> {
    return this.courseRepository.find({
      where: {
        habit: {
          id: habitId,
        },
      },
      ...this.defaultRelations,
    });
  }

  // CREATE
  async createCourse(course: CreateCourseDTO): Promise<CourseEntity> {
    const newCourse = this.courseRepository.create({
      ...course,
      status: courseStatuses.PENDING,
    });

    return this.courseRepository.save(newCourse);
  }

  // UPDATE
  async updateCourse(
    id: CourseEntity["id"],
    course: UpdateCourseDTO
  ): Promise<UpdateResult> {
    return this.courseRepository.update(id, course);
  }

  // DELETE
  async deleteCourse(id: CourseEntity["id"]): Promise<void> {
    await this.courseRepository.delete(id);
  }

  // ACTIONS
  async startCourse(courseId: CourseEntity["id"]): Promise<UpdateResult> {
    return this.courseRepository.update(courseId, {
      status: courseStatuses.ACTIVE,
      startDate: Date.now(),
    });
  }

  async finishCourse(courseId: CourseEntity["id"]): Promise<UpdateResult> {
    const course = await this.getCourseById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    const tasks = course.tasks;

    const allAttempts = (
      await Promise.all(
        tasks.map((task) => attemptService.getAttemptsByTaskId(task.id))
      )
    ).flat();

    const successAttempts = allAttempts.filter(
      (attempt) => attempt.status === AttemptStatus.FINISHED
    );

    const successPercentage =
      (successAttempts.length / allAttempts.length) * 100;

    if (successPercentage >= course.successPercentage) {
      return this.successCourse(courseId);
    } else {
      return this.failCourse(courseId);
    }
  }

  async failCourse(courseId: CourseEntity["id"]): Promise<UpdateResult> {
    return this.courseRepository.update(courseId, {
      status: courseStatuses.FAILED,
    });
  }

  async successCourse(courseId: CourseEntity["id"]): Promise<UpdateResult> {
    return this.courseRepository.update(courseId, {
      status: courseStatuses.FINISHED,
    });
  }
}

export const courseService = new CourseService(CourseRepository);
