// Core
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

// Environment
import { environment } from '../environments/environment';

// Models
import { Story, StoryCard, StoryDTO } from '@models/story.model';
import { Block, BlockContent } from '@models/block-content.model';

@Injectable({ providedIn: 'root' })
export class StoryService {
  private readonly prefix = `${environment.apiUrl}api/story`;
  constructor(private http: HttpClient) {}
  public getBySlug(slug: string): Observable<Story> {
    const params = new HttpParams().set('slug', slug);
    return this.http
      .get<StoryDTO>(`${this.prefix}/read`, { params })
      .pipe(map((story) => this.parseStoryContent(story)));
  }

  // ToDo: Rediseñar funcionamiento del endpoint de autores.
  public getAuthors(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.prefix}/authors`);
  }

  // ToDo: Rediseñar funcionamiento del endpoint de links originales.
  public getOriginalLinks(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.prefix}/original-links`);
  }

  public parseStoryCardContent(story: StoryDTO): StoryCard {
    return {
      ...story,
      prologues: story.prologues ?? [],
      paragraphs:
        story?.paragraphs?.map((x: BlockContent) => this.parseParagraph(x)) ??
        [],
      summary:
        story?.summary?.map((x: BlockContent) => this.parseParagraph(x)) ?? [],
    };
  }

  private parseStoryContent(story: StoryDTO): Story {
    return {
      ...story,
      prologues: story.prologues ?? [],
      paragraphs:
        story?.paragraphs?.map((x: BlockContent) => this.parseParagraph(x)) ??
        [],
      summary:
        story?.summary?.map((x: BlockContent) => this.parseParagraph(x)) ?? [],
      author: {
        ...story.author,
        biography:
          story.author.biography?.map((x) => this.parseParagraph(x)) ?? [],
      },
    };
  }

  private parseParagraph(block: BlockContent): string {
    let paragraph = '';

    block.children.forEach((x: Block) => {
      let part = x.text;
      if (x.marks?.includes('em')) {
        part = this.addEmphasis(part);
      }
      if (x.marks?.includes('strong')) {
        part = this.addStrong(part);
      }

      part = part.replaceAll('\n', '<br/>');

      paragraph = paragraph.concat(part);
    });
    return paragraph;
  }

  private addEmphasis(text: string): string {
    return `<i>${text}</i>`;
  }

  private addStrong(text: string): string {
    return `<strong>${text}</strong>`;
  }
}
