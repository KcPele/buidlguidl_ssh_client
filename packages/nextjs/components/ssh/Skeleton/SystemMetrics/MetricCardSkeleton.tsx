const MetricCardSkeleton = () => (
  <div className="bg-base-200 rounded-lg p-4 shadow-sm animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-base-300 rounded" />
      <div>
        <div className="h-4 w-20 bg-base-300 rounded mb-2" />
        <div className="h-6 w-16 bg-base-300 rounded" />
      </div>
    </div>
  </div>
);

export default MetricCardSkeleton;
