import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";
import { forEach } from "cypress/types/lodash";


describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("findAllCourses -> should retrive all courses", () => {
    coursesService.findAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy('no courses returned');
      expect(courses.length).toBe(12, 'incorrect numbers of courses');

      const course = courses.find(course => course.id === 12)
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual("GET");

    req.flush({ payload: Object.values(COURSES) });

  });

  it("findCourseById -> should retrive course by id", () => {
    coursesService.findCourseById(12).subscribe(course => {
      expect(course).toBeTruthy('no course with id returned');
      expect(course.id).toBe(12);

    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual("GET");

    req.flush(COURSES[12]);

  });

  it("saveCourse -> should save the course data", () => {
    const changes: Partial<Course> = { titles: { description: "Testing Course" } };
    coursesService.saveCourse(12, changes).subscribe(course => {
      expect(course.id).toBe(12);

    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(changes.titles.description)

    req.flush({
      ...COURSES[12],
      ...changes
    });

  });

  it("saveCourse -> should give an error if save course failed", () => {
    const changes: Partial<Course> = { titles: { description: "Testing Course" } };
    coursesService.saveCourse(12, changes).subscribe(
      () => fail('the save course should failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual("PUT");

    req.flush('save course failed', { status: 500, statusText: 'Internal Server Error' })

  });

  it("findLessons -> should find a list of lessons", () => {
    coursesService.findLessons(12).subscribe(lessons => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(req => req.url == '/api/lessons');
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    })

  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
