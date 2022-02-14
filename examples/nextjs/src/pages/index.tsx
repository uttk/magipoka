import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <Link href="/">
          <a>Index Page</a>
        </Link>
      </main>
    </div>
  );
};

export default Home;
