import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async testing examples", () => {

    it("Async test example with Jasmine done()", (done: DoneFn) => {
        let test = false;

        setTimeout(() => {
            console.log("running assertion - Jasmine done()");
            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000);
    });

    it("Async test example with setTimeout()", fakeAsync(() => {
        let test = false;

        setTimeout(() => {
            console.log("running assertion - setTimeout()");
            test = true;
        }, 1000);

        // tick(500);
        // tick(499);
        // tick(1);

        flush();
        expect(test).toBeTruthy();
    }));

    it("Async test example with plaine Promise", fakeAsync(() => {
        let test = false;

        console.log("Creating promise")

        Promise.resolve().then(() => {
            console.log("Promise first then() evaluated successfully")
            return Promise.resolve();
        }).then(() => {
            console.log("Promise second then() evaluated successfully")
            test = true;
        });
        flushMicrotasks();
        console.log("running assertion - plain Promise");
        expect(test).toBeTruthy();
    }));

    it("Async test example with plaine Promise + setTimeout", fakeAsync(() => {
        let counter = 0;

        Promise.resolve().then(() => {
            counter += 10;
            setTimeout(() => {
                counter += 1;
            }, 1000);;
        });
        
        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10);
        tick(500);
        expect(counter).toBe(10);
        tick(500);
        expect(counter).toBe(11);
    }));

    it("Async test example with Observable", fakeAsync(() => {
        let test = false;
        console.log("Creating observable");
        const test$ = of(test).pipe(delay(1000)).subscribe(() => {
            test = true;
        })

        tick(1000);
        expect(test).toBe(true);
        console.log("running assertion - Observable");
    }));
});