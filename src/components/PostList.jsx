import Link from 'next/link';
import { Pagination } from './Pagination';
import { Vote } from './Vote';
import { db } from '@/db';
import { POSTS_PER_PAGE } from '@/config';

export async function PostList({ currentPage = 1 }) {
  const { rows: posts } =
    await db.query(`SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
    COALESCE(SUM(votes.vote), 0) AS vote_total
     FROM posts
     JOIN users ON posts.user_id = users.id
     LEFT JOIN votes ON votes.post_id = posts.id
     GROUP BY posts.id, users.name
     ORDER BY vote_total DESC
     LIMIT ${POSTS_PER_PAGE}
     OFFSET ${POSTS_PER_PAGE * (currentPage - 1)}`);

  return (
    <>
      <ul className="max-w-screen-lg mx-auto p-4 mb-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className=" py-4 flex space-x-6 hover:bg-zinc-200 rounded-lg"
          >
            <Vote postId={post.id} votes={post.vote_total} />
            <div>
              <Link
                href={`/post/${post.id}`}
                className="text-3xl hover:text-pink-500"
              >
                {post.title}
              </Link>
              <p className="text-zinc-700">posted by {post.name}</p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination currentPage={currentPage} />
    </>
  );
}
