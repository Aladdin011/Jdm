// Loading Skeleton for Blog Page
export const BlogSkeleton = () => {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading blog posts">
      <div className="grid md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white/50 rounded-2xl overflow-hidden shadow-lg border border-white/20">
            {/* Image skeleton */}
            <div className="h-48 bg-gray-300"></div>
            
            {/* Content skeleton */}
            <div className="p-6">
              {/* Date and read time */}
              <div className="flex space-x-4 mb-3">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
              
              {/* Title */}
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              
              {/* Excerpt */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
              
              {/* Tags */}
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-300 rounded-lg w-16"></div>
                <div className="h-6 bg-gray-300 rounded-lg w-20"></div>
                <div className="h-6 bg-gray-300 rounded-lg w-24"></div>
              </div>
              
              {/* Author and button */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="h-3 bg-gray-300 rounded w-20 mb-2"></div>
                    <div className="h-2 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-10 bg-gray-300 rounded-xl w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading blog posts, please wait...</span>
    </div>
  );
};

export default BlogSkeleton;

