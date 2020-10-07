import { Component } from '@angular/core';


@Component({
  selector: 'app-main-list',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.css']
})
export class MainListComponent  {
  // dapps-serverからデータをGETする
  // allMains: Array<Main> = [];
  // userName: string;

  // constructor(private mainService: MainService) { }

  // ngOnInit() {
  //   this.getAllMains();
  // }

  // private getAllMains() {
  //   this.mainService.getAllMains().subscribe(allEmployeyes => {
  //     this.allMains = allEmployeyes;
  //   });
  // }

  // addMain() {
  //   alert(this.userName);
  //   this.mainService.addMain(this.userName).subscribe(response => {
  //     console.log(response);
  //     this.getAllMains();
  //   });
  // }
}
