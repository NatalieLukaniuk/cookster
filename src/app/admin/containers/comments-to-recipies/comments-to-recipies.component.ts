import { take } from 'rxjs/operators';
import { AdminService } from './../../services/admin.service';
import { Component, Input, OnInit } from '@angular/core';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

export interface AdminCommentMapped {
  recipyName: string;
  text: string;
  commentId: string;
}
@Component({
  selector: 'app-comments-to-recipies',
  templateUrl: './comments-to-recipies.component.html',
  styleUrls: ['./comments-to-recipies.component.scss'],
})
export class CommentsToRecipiesComponent implements OnInit {
  @Input()
  recipies!: Recipy[];
  constructor(private adminService: AdminService) {}

  comments: AdminCommentMapped[] = [];

  ngOnInit() {
    this.adminService.getAdminComments().subscribe((res) => {
      let converted = Object.entries(res);
      this.comments = converted.map((comment) => ({
        recipyName: this.getRecipyName(comment[1].recipyId),
        text: comment[1].text,
        commentId: comment[0],
      }));
    });
  }

  getRecipyName(recipyId: string): string {
    if (this.recipies.find((recipy) => recipy.id === recipyId)) {
      return this.recipies.find((recipy) => recipy.id === recipyId)!.name;
    } else return '';
  }

  deleteComment(comment: AdminCommentMapped) {
    this.adminService.deleteComment(comment).pipe(take(1)).subscribe(() => {
      this.comments = this.comments.filter(comm => !(comment.commentId ===comm.commentId))
    });
  }
}
