import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement, inject } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';
import { take } from 'rxjs/operators';



describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let debugElement: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER')
  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED')

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy: jasmine.SpyObj<CoursesService> = jasmine.createSpyObj('CoursesService', ['findAllCourses'])
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    })
  }))

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(
      of(beginnerCourses) // RxJS observable
    );
    fixture.detectChanges();
    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    const tabLabel = debugElement.query(By.css(".mat-tab-label-content"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
    expect(tabLabel.nativeElement.textContent).toBe("Beginners", "Incorrect tab title");
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(
      of(advancedCourses) // RxJS observable
    );
    fixture.detectChanges();
    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    const tabLabel = debugElement.query(By.css(".mat-tab-label-content"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
    expect(tabLabel.nativeElement.textContent).toBe("Advanced", "Incorrect tab title");
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses()) // RxJS observable
    );
    fixture.detectChanges();
    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    const tabsTitles = debugElement.queryAll(By.css(".mat-tab-label-content"));

    expect(tabs.length).toBe(2, "Expected to find 2 tabs");
    expect(tabsTitles[0].nativeElement.textContent).toBe("Beginners", "Incorrect tab title");
    expect(tabsTitles[1].nativeElement.textContent).toBe("Advanced", "Incorrect tab title");
  });


  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses()) // RxJS observable
    );
    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);
    fixture.detectChanges();
    flush();

    const cardTitles = debugElement.queryAll(By.css(".mat-tab-body-active .mat-card-title"));
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");

  }));

  it("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses()) // RxJS observable
    );
    fixture.detectChanges();
    
    const tabs = debugElement.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      console.log("called whenStable");
      const cardTitles = debugElement.queryAll(By.css(".mat-tab-body-active .mat-card-title"));
      expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
      expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
    });

  }));

});


