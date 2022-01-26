import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/core';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private octokit: Octokit;
  constructor(private http: HttpClient) {
    this.octokit = new Octokit({
      auth: environment.auth,
    });
  }

  async issues() {
    const response = await this.octokit.graphql(
      `{
        repository(owner: "zyxbest", name: "db") {
          issues(first: 10) {
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

  // post(){

  // }
}
