const OrdersTableFilters = ({
  search,
  setSearch,
  filters,
  filterOptions,
  setShowShirtDropdown,
  showShirtDropdown,
  setShowColorDropdown,
  showColorDropdown,
  setShowSizeDropdown,
  showSizeDropdown,
  setShowDeliveryDropdown,
  showDeliveryDropdown,
  handleFilterChange,
  onPageChange,
  page,
}: {
  search: string;
  setSearch: (value: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
  filterOptions: any;

  showShirtDropdown: boolean;
  setShowShirtDropdown: (show: boolean) => void;
  showColorDropdown: boolean;
  setShowColorDropdown: (show: boolean) => void;
  showSizeDropdown: boolean;
  setShowSizeDropdown: (show: boolean) => void;
  showDeliveryDropdown: boolean;
  setShowDeliveryDropdown: (show: boolean) => void;
  handleFilterChange: (key: string, value: string) => void;
  onPageChange: (page: number) => void;
  page: number;
}) => {
  return (
    <div className="flex flex-col w-full max-w-full gap-2 mb-4 md:flex-row md:items-center md:gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          if (page !== 1) {
            onPageChange(1); // Reset to page 1 when search changes
          }
          setSearch(value);
          const params = new URLSearchParams(window.location.search);
          if (value) {
            params.set("search", value);
          } else {
            params.delete("search");
          }
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, "", newUrl);
        }}
        placeholder="Search orders..."
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
      />
      <div className="relative w-full">
        <button
          type="button"
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-left lowercase bg-white border border-gray-300 rounded"
          onClick={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
        >
          {filters.deliveryMethod || "All Delivery Methods"}
          <span>▾</span>
        </button>
        {showDeliveryDropdown && (
          <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-64">
            <div
              onClick={() => {
                handleFilterChange("deliveryMethod", "");
                setShowDeliveryDropdown(false);
              }}
              className="px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
            >
              All Delivery Methods
            </div>
            <div
              onClick={() => {
                handleFilterChange("deliveryMethod", "ship");
                setShowDeliveryDropdown(false);
              }}
              className="px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
            >
              Ship
            </div>
            <div
              onClick={() => {
                handleFilterChange("deliveryMethod", "pickup");
                setShowDeliveryDropdown(false);
              }}
              className="px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
            >
              Pickup
            </div>
          </div>
        )}
      </div>
      <div className="relative w-full ">
        <button
          type="button"
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-left lowercase bg-white border border-gray-300 rounded"
          onClick={() => setShowShirtDropdown(!showShirtDropdown)}
        >
          {filters.item || "All Items"}
          <span>▾</span>
        </button>
        {showShirtDropdown && (
          <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-64">
            <div
              onClick={() => {
                handleFilterChange("item", "");
                setShowShirtDropdown(false);
              }}
              className="px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
            >
              All Items
            </div>
            {filterOptions.products.map((product: any) => {
              return (
                <div
                  key={product.name}
                  onClick={() => {
                    handleFilterChange("item", product.name);
                    setShowShirtDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={product.images?.[0]?.url || "/fallback.jpg"}
                    alt=""
                    className="object-cover w-6 h-6 rounded"
                  />
                  {product.name}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative w-full lowercase">
        <button
          type="button"
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-left lowercase bg-white border border-gray-300 rounded"
          onClick={() => setShowColorDropdown(!showColorDropdown)}
        >
          {filters.color || "All Colors"}
          <span>▾</span>
        </button>
        {showColorDropdown && (
          <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-64">
            <div
              onClick={() => {
                handleFilterChange("color", "");
                setShowColorDropdown(false);
              }}
              className="px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
            >
              All Colors
            </div>
            {filterOptions.colors.map((color: any) => (
              <div
                key={color.key}
                onClick={() => {
                  handleFilterChange("color", color.name);
                  setShowColorDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                <span
                  className="w-4 h-4 border rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative w-full ">
        <button
          type="button"
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-left lowercase bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
          onClick={() => setShowSizeDropdown(!showSizeDropdown)}
        >
          {filters.size || "All Sizes"}
          <span>▾</span>
        </button>
        {showSizeDropdown && (
          <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-64">
            <div
              onClick={() => {
                handleFilterChange("size", "");
                setShowSizeDropdown(false);
              }}
              className="px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
            >
              All Sizes
            </div>
            {filterOptions.sizes.map((size: any) => (
              <div
                key={size.key}
                onClick={() => {
                  handleFilterChange("size", size.label);
                  setShowSizeDropdown(false);
                }}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {size.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTableFilters;
