import { AdminService } from './../../services/admin.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments-to-recipies',
  templateUrl: './comments-to-recipies.component.html',
  styleUrls: ['./comments-to-recipies.component.scss']
})
export class CommentsToRecipiesComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getAdminComments().subscribe(res => {console.log(res)})
  }

}
