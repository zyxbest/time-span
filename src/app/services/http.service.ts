import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/core';
import { ISSUE_BASIC } from 'assets/issue';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
moment.locale('zh-CN');
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private octokit: Octokit;

  private readonly dayStart = moment()
    .hour(0)
    .minute(0)
    .second(0)
    .toISOString();

  constructor(private toastr: ToastrService) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.octokit = new Octokit({
      auth: user['tokenValue'],
      // timeZone: 'Asia/Shanghai',
    });
    ISSUE_BASIC.owner = user['username'];
  }

  async issues() {
    const response = await this.octokit.graphql(
      `{
        repository(owner: "${ISSUE_BASIC.owner}", name: "db") {
          issues(last: 20, filterBy:{since:"${this.dayStart}"}) {
            edges {
              node {
                number
                title
                labels(first: 5) {
                  edges {
                    node {
                      name
                    }
                  }
                }
                body
                createdAt
                updatedAt
              }
              cursor
            }
          }
        }
      }`
    );
    return response;
  }

  post(span: number, content: string) {
    return this.octokit
      .request('POST /repos/{owner}/{repo}/issues', {
        ...ISSUE_BASIC,
        body: span + '',
        title: content,
      })
      .then((id) => {
        this.update(id.data.number, { state: 'closed' });
      })
      .catch((error: Error) => {
        this.toastr.error(error.message);
      });
  }

  update(id: number, body: any) {
    return this.octokit
      .request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
        ...ISSUE_BASIC,
        issue_number: id,
        ...body,
      })
      .catch((error: Error) => {
        this.toastr.error(error.message);
      });
  }

  createIssueComment(content: string, id: number) {
    return this.octokit
      .request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
        ...ISSUE_BASIC,
        issue_number: id,
        body: content,
      })
      .catch((error: Error) => {
        this.toastr.error(error.message);
      });
  }

  listComments(id: number) {
    return this.octokit
      .request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
        ...ISSUE_BASIC,
        issue_number: id,
      })
      .catch((error: Error) => {
        this.toastr.error(error.message);
      });
  }

  updateComment(id: number, content: string) {
    return this.octokit
      .request('PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}', {
        ...ISSUE_BASIC,
        comment_id: id,
        body: content,
      })
      .catch((error: Error) => {
        this.toastr.error(error.message);
      });
  }
}
