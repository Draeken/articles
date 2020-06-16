import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  formRange: FormGroup;
  formSlider: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formRange = this.formBuilder.group({
      range: [{ start: 0, end: 1 }],
    });

    this.formSlider = this.formBuilder.group({
      slide: [1],
    });
  }
}
