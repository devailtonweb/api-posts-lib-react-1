import { useCallback, useEffect, useState } from 'react';
import './style.css';
import { PostsCard } from '../PostsCard';
import { ButtomLoadMorePosts } from '../Button';
import { Search } from '../Search';

export const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [postsPerPage] = useState(10);
    const [search, setSearch] = useState('');

    const handleLoadMorePosts = useCallback(async (page, postsPerPage) => {
        const postsAndPhotos = await loadPosts();

        setPosts(postsAndPhotos.slice(page, postsPerPage));
        setAllPosts(postsAndPhotos);
    }, []);

    useEffect(() => {
        handleLoadMorePosts(0, postsPerPage);
    }, [handleLoadMorePosts, postsPerPage]);

    const loadPosts = async () => {
        const postsResponse = fetch('https://jsonplaceholder.typicode.com/posts');
        const photosResponse = fetch('https://jsonplaceholder.typicode.com/photos');

        const [posts, photos] = await Promise.all([postsResponse, photosResponse]);

        const postsJson = await posts.json();
        const photosJson = await photos.json();

        const postsAndPhotos = postsJson.map((post, index) => {
            return { ...post, cover: photosJson[index].url };
        });

        return postsAndPhotos;
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearch(value);
    };

    const loadMorePosts = () => {
        const nextPage = page + postsPerPage;
        const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
        posts.push(...nextPosts);

        setPosts(posts);
        setPage(nextPage);
    };

    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filteredPosts = search
        ? allPosts.filter((post) => {
              return post.title.toLowerCase().includes(search.toLowerCase());
          })
        : posts;

    return (
        <section className="container">
            <div>
                <Search value={search} onChange={handleSearch} />
            </div>
            <div className="posts">
                {filteredPosts.length > 0 && filteredPosts.map((post = []) => <PostsCard key={post.id} posts={post} />)}

                {filteredPosts.length === 0 && <h3>Nenhum post encontrado :(</h3>}
            </div>
            <div className="container-button">
                {!search && (
                    <ButtomLoadMorePosts text={'Load more posts'} onClick={loadMorePosts} disabled={noMorePosts} />
                )}
            </div>
        </section>
    );
};

/*
Usando Class Components

export class Posts extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 10,
    search: "",
  };

  loadPosts = async () => {
    const postsResponse = fetch("https://jsonplaceholder.typicode.com/posts");
    const photosResponse = fetch("https://jsonplaceholder.typicode.com/photos");

    const [posts, photos] = await Promise.all([postsResponse, photosResponse]);

    const postsJson = await posts.json();
    const photosJson = await photos.json();

    const postsAndPhotos = postsJson.map((post, index) => {
      return { ...post, cover: photosJson[index].url };
    });

    const { page, postsPerPage } = this.state;

    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,
    });
  };

  loadMorePosts = () => {
    const { posts, allPosts, page, postsPerPage } = this.state;
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    this.setState({ posts, page: nextPage });
  };

  handleSearch = (e) => {
    const { value } = e.target;
    this.setState({ search: value });
  };

  componentDidMount() {
    this.loadPosts();
  }

  render() {
    const { posts, allPosts, page, postsPerPage, search } = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filteredPosts = !!search
      ? allPosts.filter((post) => {
          return post.title.toLowerCase().includes(search.toLowerCase());
        })
      : posts;

    return (
      <section className="container">
        <div>
          <Search value={search} onChange={this.handleSearch} />
        </div>
        <div className="posts">
          {filteredPosts.length > 0 &&
            filteredPosts.map((post) => (
              <PostsCard key={post.id} posts={post} />
            ))}

          {filteredPosts.length === 0 && <h3>Nenhum post encontrado :(</h3>}
        </div>
        <div className="container-button">
          {!search && (
            <ButtomLoadMorePosts
              text={"Load more posts"}
              onClick={this.loadMorePosts}
              disabled={noMorePosts}
            />
          )}
        </div>
      </section>
    );
  }
}
*/
