import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

describe('Error Pages', () => {
  describe('NotFoundComponent', () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NotFoundComponent],
        providers: [provideRouter([])]
      }).compileComponents();

      fixture = TestBed.createComponent(NotFoundComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create not found component', () => {
      expect(component).toBeTruthy();
    });

    it('should render 404 message', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('404');
      expect(el.textContent).toContain('Mesa o Sección No Encontrada');
    });
  });

  describe('ForbiddenComponent', () => {
    let component: ForbiddenComponent;
    let fixture: ComponentFixture<ForbiddenComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ForbiddenComponent],
        providers: [
          provideRouter([]),
          provideHttpClient(),
          provideHttpClientTesting()
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ForbiddenComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create forbidden component', () => {
      expect(component).toBeTruthy();
    });

    it('should render 403 message', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('403');
      expect(el.textContent).toContain('Acceso Restringido');
    });
  });
});
