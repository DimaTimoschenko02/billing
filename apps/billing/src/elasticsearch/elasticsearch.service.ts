import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export interface Bill {
  [key: string]: any;
}

export interface PostSearchBody {
  [key: string]: any;
}

interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}


@Injectable()
export default class PostsSearchService {
  index = 'posts';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
  ) {
  }

  async indexBill(bill: Bill) {
    return this.elasticsearchService.index({
      index: this.index,
      body: {
        ...bill,
      },
    });
  }

  async search(text: string) {
    // @ts-ignore
    const { body } = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}