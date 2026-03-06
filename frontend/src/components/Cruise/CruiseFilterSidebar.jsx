import React from "react";
import { Slider, InputNumber, Button, Checkbox } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

// Constants (Có thể đưa vào file constants riêng nếu muốn dùng ở nhiều nơi)
const FILTER_OPTIONS = {
    durations: ["Day Cruise", "2 Days 1 Night", "3 Days 2 Nights", "4 Days 3 Nights"],
    amenities: ["Balcony", "Bathtub", "Swimming Pool", "Spa & Massage", "Gym", "Karaoke"],
    stars: [5, 4, 3]
};

const CruiseFilterSidebar = ({
                                 filters,
                                 setFilters,
                                 priceRange,
                                 setPriceRange,
                                 onApplyPrice,
                                 onCheckboxChange,
                                 onTypeChange,
                                 cruiseTypes
                             }) => {
    // Formatters for Price Input
    const currencyFormatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const currencyParser = (value) => value ? value.replace(/\.\s?|(,*)/g, '') : '';

    return (
        <div className="space-y-7 divide-y divide-gray-100">
            {/* 1. Search */}
            <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Search</h4>
                <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={filters.search || ""}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* 2. Price Range */}
            <div className="pt-6">
                <h4 className="font-bold text-gray-900 mb-4 text-sm">Price Range</h4>
                <div className="px-1">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Min</span>
                            <InputNumber
                                className="w-full bg-gray-50 border-gray-200 rounded-lg text-xs font-bold text-gray-700"
                                min={0}
                                max={priceRange[1]}
                                value={priceRange[0]}
                                onChange={(val) => setPriceRange([val || 0, priceRange[1]])}
                                formatter={currencyFormatter}
                                parser={currencyParser}
                                suffix="đ"
                                controls={false}
                            />
                        </div>
                        <div className="mt-4 text-gray-300">—</div>
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Max</span>
                            <InputNumber
                                className="w-full bg-gray-50 border-gray-200 rounded-lg text-xs font-bold text-gray-700"
                                min={priceRange[0]}
                                max={50000000}
                                value={priceRange[1]}
                                onChange={(val) => setPriceRange([priceRange[0], val || 0])}
                                formatter={currencyFormatter}
                                parser={currencyParser}
                                suffix="đ"
                                controls={false}
                            />
                        </div>
                    </div>

                    <Slider
                        range
                        min={0}
                        max={50000000}
                        step={50000}
                        value={priceRange}
                        onChange={(val) => setPriceRange(val)}
                        trackStyle={[{ backgroundColor: '#84cc16', height: 6, borderRadius: 4 }]}
                        railStyle={{ backgroundColor: '#ecfccb', height: 6, borderRadius: 4 }}
                        handleStyle={[
                            { borderColor: '#fff', backgroundColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', opacity: 1 },
                            { borderColor: '#fff', backgroundColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', opacity: 1 }
                        ]}
                    />

                    <div className="flex justify-end mt-4">
                        <Button
                            className="rounded-full px-6 border-gray-300 font-bold text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
                            size="middle"
                            onClick={onApplyPrice}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </div>

            {/* 3. Star Rating */}
            <div className="pt-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Star Rating</h4>
                <div className="flex flex-col gap-2">
                    {FILTER_OPTIONS.stars.map((star) => (
                        <label key={star} className="flex items-center gap-3 cursor-pointer group">
                            <Checkbox
                                checked={filters.stars.includes(star)}
                                onChange={() => onCheckboxChange('stars', star)}
                            />
                            <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < star ? "" : "text-gray-200"} />
                                ))}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* 4. Duration */}
            <div className="pt-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Duration</h4>
                <div className="flex flex-col gap-2.5">
                    {FILTER_OPTIONS.durations.map((duration) => (
                        <label key={duration} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors">
                            <Checkbox
                                checked={filters.durations.includes(duration)}
                                onChange={() => onCheckboxChange('durations', duration)}
                            />
                            <span className="text-sm text-gray-600 font-medium">{duration}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 5. Cruise Type */}
            <div className="pt-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Cruise Type</h4>
                <div className="grid grid-cols-2 gap-2 md:block md:space-y-2">
                    {cruiseTypes.map((type, idx) => (
                        <div
                            key={idx}
                            onClick={() => onTypeChange(type.name)}
                            className={`
                                flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-all border
                                ${filters.type === type.name ? 'bg-red-50 border-red-200 shadow-sm' : 'border-transparent hover:bg-gray-50'}
                            `}
                        >
                            <img src={type.img} alt="" className="w-8 h-8 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate ${filters.type === type.name ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {type.name}
                                </div>
                                <div className="text-[10px] text-gray-400">{type.count} options</div>
                            </div>
                            {filters.type === type.name && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. Amenities */}
            <div className="pt-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Amenities</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    {FILTER_OPTIONS.amenities.map((amenity) => (
                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={filters.amenities.includes(amenity)}
                                onChange={() => onCheckboxChange('amenities', amenity)}
                            />
                            <span className="text-xs text-gray-600">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CruiseFilterSidebar;