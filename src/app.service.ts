/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Response, Express } from 'express';
import { UsersService } from './users/users.service';
import { Octokit } from 'octokit';

@Injectable()
export class AppService {
  constructor(private readonly userService: UsersService) {}

  async activateEmail(token: string): Promise<boolean> {
    return this.userService.activateEmail(token);
  }

  async uploadFile(file: Express.Multer.File, res: Response): Promise<any> {
    try {
      const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

      const REPO = 'channels_files';
      // const repos = await octokit.rest.repos.listForAuthenticatedUser();
      // if (repos.status ===200) {
      // console.log('repos', repos);

      try {
        await octokit.rest.repos.get({
          owner: 'chukwuka-emi',
          repo: 'channels_files',
        });
      } catch (error) {
        if (error.response.status === 404) {
          await octokit.rest.repos.createForAuthenticatedUser({
            name: REPO,
            auto_init: true,
          });
        } else {
          console.log('error getting error', error);
          res.status(500).json({ message: 'Error uploading file' });
        }
      }

      // upload file to repository
      const uploadResponse =
        await octokit.rest.repos.createOrUpdateFileContents({
          path: file.originalname,
          message: 'Uploaded file',
          owner: 'chukwuka-emi',
          repo: REPO,
          content: file.buffer.toString('base64'),
        });
      //clear the Memory Storage
      file.buffer = null;
      return res
        .status(201)
        .json({ imageUrl: uploadResponse.data.content.download_url });
      // }
    } catch (error) {
      console.log('error', error.message);
      res.status(500).json({ message: 'Error uploading file' });
    }
  }
}
