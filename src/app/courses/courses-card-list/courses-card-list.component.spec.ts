import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let debugElement: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    })
  }))

  it("should create the component", () => {
   expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const cards = debugElement.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy("Could not find courses")
    expect(cards.length).toBe(12, "Unexpected numer of courses")
  });


  it("should display the first course", () => {
    const courses = component.courses = setupCourses();
    fixture.detectChanges();
    const course = courses[0];

    const card = debugElement.query(By.css(".course-card:first-child"));
    const title = card.query(By.css("mat-card-title"));
    const image = card.query(By.css("img"));

    expect(card).toBeTruthy("Could not find course card")
    expect(title.nativeElement.textContent).toBe(course.titles.description)
    expect(image.nativeElement.src).toBe(course.iconUrl)

  });


});


