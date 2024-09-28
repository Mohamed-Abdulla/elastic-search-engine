interface SearchResponse<T> {
  hits: {
    total: { value: number; relation: string };
    hits: Array<{
      _id: string;
      _source: T;
    }>;
  };
}

interface BookWithDetails {
  title: string;
  subtitle?: string; // Optional field
  authors: string[];
  description: string;
  // Add other fields based on your index mapping
}

interface Book {
  title: string;
  author: string;
  // Add other fields if necessary
}
