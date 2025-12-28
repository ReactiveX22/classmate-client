import { Post } from '@/lib/api/services/post.service';
import { AnnouncementCard } from './post-types/announcement-card';
import { AssignmentCard } from './post-types/assignment-card';
import { MaterialCard } from './post-types/material-card';
import { QuestionCard } from './post-types/question-card';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  switch (post.type) {
    case 'announcement':
      return <AnnouncementCard post={post} />;
    case 'assignment':
      return <AssignmentCard post={post} />;
    case 'material':
      return <MaterialCard post={post} />;
    case 'question':
      return <QuestionCard post={post} />;
    default:
      return null;
  }
}
