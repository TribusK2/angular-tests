import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe('CalculatorService', () => {
  let calculatorService: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    })
    calculatorService = TestBed.inject(CalculatorService);
  })

  it('add -> Should add two numbers', () => {
    const result = calculatorService.add(2, 2);
    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('subtract -> Should subtract two numbers', () => {
    const result = calculatorService.subtract(2, 2);
    expect(result).toBe(0, 'unexpected subtract result');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
})