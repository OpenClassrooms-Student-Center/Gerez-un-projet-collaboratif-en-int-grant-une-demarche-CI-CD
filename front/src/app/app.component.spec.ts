import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { JokesService } from "./services/jokes.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('AppComponent', () => {

  let component: AppComponent;
  let jokesService: JokesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
      providers: [JokesService]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    jokesService = TestBed.inject(JokesService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRandomJoke on init', () => {
    spyOn(jokesService, 'getRandomJoke');
    component.ngOnInit();
    expect(jokesService.getRandomJoke).toHaveBeenCalled();
  });

  it('should call getRandomJoke method', () => {
    spyOn(jokesService, 'getRandomJoke');
    component.getRandomJoke();
    expect(jokesService.getRandomJoke).toHaveBeenCalled();
  });

});