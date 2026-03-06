import { useState, useEffect } from "react";
import { DatePicker, Input, Select, Slider, Button, InputNumber } from "antd";
import { IoIosSearch } from "react-icons/io";
import { cities } from "../../common/common.js";

const TourFilterSidebar = ({
                               filterParams,
                               setFilterParams,
                               tempSearch,
                               setTempSearch,
                               handleMainSearch,
                               isInsideModal = false // Prop to check if rendered inside the popup
                           }) => {
    // --- LOCAL STATE FOR PRICE ---
    // Prevents lagging while dragging slider. Only updates parent on "Apply"
    const [priceRange, setPriceRange] = useState([filterParams.minPrice || 0, filterParams.maxPrice || 30000000]);

    // Sync local state if parent resets filters
    useEffect(() => {
        setPriceRange([filterParams.minPrice || 0, filterParams.maxPrice || 30000000]);
    }, [filterParams.minPrice, filterParams.maxPrice]);

    // Formatters for Currency Input
    const currencyFormatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const currencyParser = (value) => value ? value.replace(/\.\s?|(,*)/g, '') : '';

    const handleApplyPrice = () => {
        setFilterParams(prev => ({
            ...prev,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            page: 1
        }));
    };

    const handleReset = () => {
        setFilterParams(prev => ({
            ...prev,
            city: undefined,
            minPrice: 0,
            maxPrice: 10000000,
            duration: null,
            search: ""
        }));
    };

    const SectionTitle = ({ title }) => (
        <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-3 mt-1">{title}</h4>
    );

    return (
        <div className={`h-full flex flex-col overflow-hidden ${isInsideModal ? '' : 'bg-white rounded-xl border border-gray-100 shadow-sm'}`}>

            {/* ONLY SHOW THIS HEADER IF NOT IN MODAL (Desktop View) */}
            {!isInsideModal && (
                <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Filters</h3>
                    <button
                        onClick={handleReset}
                        className="text-xs font-medium text-gray-400 hover:text-teal-600 underline transition-colors"
                    >
                        Reset all
                    </button>
                </div>
            )}

            {/* Scrollable Content */}
            <div className={`${isInsideModal ? 'p-6' : 'p-5'} flex flex-col gap-7 overflow-y-auto custom-scrollbar`}>

                {/* 1. Date Picker */}
                <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-teal-700">Travel Dates</label>
                    <div className="flex flex-col gap-2">
                        <DatePicker placeholder="Start Date" className="w-full h-10 border-gray-200 rounded-lg hover:border-teal-500" format="DD/MM/YYYY" onChange={(date, dateString) => setFilterParams(prev => ({ ...prev, startDate: dateString, page: 1 }))} />
                        <DatePicker placeholder="End Date" className="w-full h-10 border-gray-200 rounded-lg hover:border-teal-500" format="DD/MM/YYYY" onChange={(date, dateString) => setFilterParams(prev => ({ ...prev, endDate: dateString, page: 1 }))} />
                    </div>
                </div>

                {/* 2. Search Name */}
                <div>
                    <SectionTitle title="Tour Name" />
                    <Input
                        prefix={<IoIosSearch className="text-gray-400" />}
                        placeholder="Search tours..."
                        value={tempSearch}
                        onChange={(e) => setTempSearch(e.target.value)}
                        onPressEnter={handleMainSearch}
                        className="rounded-lg py-2 border-gray-200 focus:border-teal-500 hover:border-teal-500"
                        allowClear
                    />
                    {/* Only show Apply button here if NOT in modal (Modal has its own big apply button) */}
                    {!isInsideModal && (
                        <Button type="primary" block className="mt-3 bg-teal-600 hover:bg-teal-700 border-none h-9 font-medium rounded-lg" onClick={handleMainSearch}>Apply Filter</Button>
                    )}
                </div>

                {/* 3. Destinations */}
                <div>
                    <SectionTitle title="Destinations" />
                    <Select
                        showSearch
                        allowClear
                        className="w-full h-10"
                        placeholder="Select destination..."
                        optionFilterProp="label"
                        value={filterParams.city || null}
                        onChange={(value) => setFilterParams(prev => ({ ...prev, city: value, page: 1 }))}
                        options={cities.map(c => ({ value: c.name, label: c.name }))}
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    />
                </div>

                {/* 4. Price Range */}
                <div>
                    <SectionTitle title="Price Range (VND)" />
                    <div className="px-1">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Min</span>
                                <InputNumber
                                    className="w-full border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:border-teal-500 focus:border-teal-500"
                                    min={0}
                                    max={priceRange[1]}
                                    value={priceRange[0]}
                                    onChange={(val) => setPriceRange([val || 0, priceRange[1]])}
                                    formatter={currencyFormatter}
                                    parser={currencyParser}
                                    style={{width : "100%"}}
                                    controls={false}
                                />
                            </div>
                            <div className="mt-4 text-gray-300">—</div>
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Max</span>
                                <InputNumber
                                    className="w-full border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:border-teal-500 focus:border-teal-500"
                                    min={priceRange[0]}
                                    max={30000000}
                                    value={priceRange[1]}
                                    onChange={(val) => setPriceRange([priceRange[0], val || 0])}
                                    formatter={currencyFormatter}
                                    parser={currencyParser}
                                    controls={false}
                                    style={{width : "100%"}}
                                />
                            </div>
                        </div>

                        <Slider
                            range
                            min={0}
                            max={10000000}
                            step={50000}
                            value={priceRange}
                            onChange={(val) => setPriceRange(val)}
                            trackStyle={[{ backgroundColor: '#84cc16', height: 6, borderRadius: 4 }]}
                            // Rail: Light Greenish/Gray background
                            railStyle={{ backgroundColor: '#ecfccb', height: 6, borderRadius: 4 }}
                            handleStyle={[
                                {
                                    backgroundColor: '#fff',
                                    borderColor: '#fff', // White border to blend in or match
                                    borderRadius: '50%', // Forces the circle shape
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)', // Soft shadow for depth
                                    opacity: 1,
                                },
                                {
                                    backgroundColor: '#fff',
                                    borderColor: '#fff',
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    opacity: 1,
                                },
                            ]}
                        />

                        <div className="flex justify-end mt-4">
                            <Button
                                className="rounded-full px-6 border-gray-200 font-bold text-gray-600 hover:text-teal-600 hover:border-teal-600 transition-colors"
                                size="middle"
                                onClick={handleApplyPrice}
                            >
                                Apply Price
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 5. Duration */}
                <div>
                    <SectionTitle title="Max Duration (Days)" />
                    <Input type="number" min={1} placeholder="e.g. 3" value={filterParams.duration} onChange={(e) => setFilterParams(prev => ({ ...prev, duration: e.target.value, page: 1 }))} className="w-full rounded-lg py-2 hover:border-teal-500 focus:border-teal-500" />
                </div>
            </div>
        </div>
    );
};
export default TourFilterSidebar;