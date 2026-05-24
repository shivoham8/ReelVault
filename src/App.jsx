import { useState } from "react";
import "./App.css";
import JSZip from "jszip";

function PostCard({ post }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail Area */}
      <div className="aspect-[4/5] bg-zinc-900 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
            <span className="text-2xl text-white ml-1">▶</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-zinc-900">
        <p className="text-white text-xs line-clamp-3 leading-relaxed min-h-[48px]">
          {post.caption || "Instagram Reel"}
        </p>

        <p className="text-xs text-red-400 mt-3 group-hover:translate-x-1 transition-transform">
          View on Instagram →
        </p>
      </div>
    </a>
  );
}

function PostGrid({ posts }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 px-4 md:px-6 py-4">
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </div>
  );
}

function fixEncoding(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

function App() {
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(event) {
    const selected = event.target.files[0];

    if (!selected) return;

    setFile(selected);
    parseZip(selected);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();

    const dropped = event.dataTransfer.files[0];

    if (!dropped) return;

    setFile(dropped);
    parseZip(dropped);
  }

  async function parseZip(file) {
    try {
      setLoading(true);
      setError("");

      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const zip = await JSZip.loadAsync(event.target.result);

          // SAVED POSTS
          const raw =
            await zip.files[
              "your_instagram_activity/saved/saved_posts.json"
            ].async("uint8array");

          const content = new TextDecoder("latin1").decode(raw);

          const data = JSON.parse(content);

          const cleanData = data.map((post) => {
            return {
              id: post.fbid,

              url:
                post.label_values.find((item) => item.label === "URL")?.href ??
                "",

              caption: fixEncoding(
                post.label_values.find((item) => item.label === "Caption")
                  ?.value ?? "",
              ),
            };
          });

          setPosts(cleanData);

          // COLLECTIONS
          const collectionsRaw =
            await zip.files[
              "your_instagram_activity/saved/saved_collections.json"
            ].async("uint8array");

          const collectionsContent = new TextDecoder("latin1").decode(
            collectionsRaw,
          );

          const collectionsData = JSON.parse(collectionsContent);

          const collectionsCleanData = collectionsData.map((collection) => {
            return {
              name: fixEncoding(collection.label_values[0].value),

              posts: collection.label_values[4].dict.map((item) => ({
                url: item.dict.find((d) => d.label === "URL")?.href ?? "",

                caption: fixEncoding(
                  item.dict.find((d) => d.label === "Caption")?.value ?? "",
                ),
              })),
            };
          });

          setCollections(collectionsCleanData);

          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Invalid Instagram export ZIP");
          setLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  }

  const visiblePosts = (
    selectedCollection === "All Posts"
      ? posts
      : (collections.find((c) => c.name === selectedCollection)?.posts ?? [])
  ).filter((post) =>
    post.caption?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center">
      {/* Upload Screen */}
      {!file && (
        <div className="flex flex-col items-center w-full max-w-lg px-6 py-12 md:py-16">
          <h1 className="text-5xl font-bold text-white mb-3">ReelVault</h1>

          <p className="text-zinc-400 text-sm mb-8 text-center">
            Browse your saved Instagram reels collection-wise
          </p>

          {/* Upload */}
          <label htmlFor="fileInput" className="cursor-pointer w-full">
            <div
              className="border-dashed border-2 border-zinc-700 rounded-2xl p-12 md:p-16 mb-6 flex flex-col items-center justify-center gap-4 hover:border-red-500 hover:bg-zinc-900 transition-all"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <span className="text-5xl">📁</span>

              <p className="text-zinc-300 font-medium text-lg text-center">
                Drop your Instagram ZIP here
              </p>

              <p className="text-zinc-500 text-sm">or click to browse</p>
            </div>
          </label>

          {/* Instructions */}
          <div className="w-full bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-800">
            <h2 className="text-white font-semibold mb-4">
              How to get your Instagram ZIP
            </h2>

            <ol className="space-y-2 text-sm text-zinc-400 list-decimal list-inside">
              <li>Open Instagram → Menu (☰) → Settings</li>

              <li>Go to Accounts Center → Your information and permissions</li>

              <li>Select Export your information → Create export</li>

              <li>Choose JSON format and select Saved posts</li>

              <li>Download the ZIP and drop it below ↓</li>
            </ol>
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {/* Loading */}
          {loading && (
            <p className="text-zinc-400 mt-4">
              Parsing your Instagram export...
            </p>
          )}

          {/* Privacy */}
          <p className="text-xs text-zinc-500 mt-4 text-center max-w-md leading-relaxed">
            Your ZIP file is processed entirely in your browser. No data is
            uploaded or stored on any server.
          </p>
        </div>
      )}

      {/* Hidden Input */}
      <input
        id="fileInput"
        type="file"
        accept=".zip"
        className="hidden"
        onChange={handleFile}
      />

      {/* Main App */}
      {file && collections.length > 0 && (
        <>
          {/* Navbar */}
          <div className="w-full sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  ReelVault
                </h1>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search captions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-red-500 w-full md:w-80"
              />
            </div>

            {/* Collections */}
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-4 pb-3">
              <button
                onClick={() => setSelectedCollection("All Posts")}
                className={
                  selectedCollection === "All Posts"
                    ? "px-3 py-1.5 bg-red-500 text-white rounded-full text-xs"
                    : "px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full text-xs hover:border-red-500 hover:text-red-400 transition-all"
                }
              >
                All Posts ({posts.length})
              </button>

              {collections.map((collection) => (
                <button
                  key={collection.name}
                  onClick={() => setSelectedCollection(collection.name)}
                  className={
                    selectedCollection === collection.name
                      ? "px-3 py-1.5 bg-red-500 text-white rounded-full text-xs"
                      : "px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full text-xs hover:border-red-500 hover:text-red-400 transition-all"
                  }
                >
                  {collection.name} ({collection.posts.length})
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="w-full">
            <PostGrid posts={visiblePosts} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
