import { InputNumber, Switch, Button, Input, DatePicker, Card, Row, Col } from "antd";
import { useState, useEffect, useMemo } from "react";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { FaShip, FaDollarSign, FaBan, FaUnlock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import moment from "moment";

import {
    uploadByFilesApi,
    uploadByLinkApi
} from "../../../api/client/api.js";
import EditorTiny from "../../TextEditor/EditorTiny.jsx";
import AdminCalendar from "../../Utils/Calendar/AdminCalendar.jsx";
import {
    getCruiseDetailApi,
    updateCruiseApi,
    getCabinTemplatesApi,
    createCabinApi
} from "../../../api/client/service.api.js";
import CruiseBasicInfo from "./CruiseBasicInfo.jsx";
import CruiseCabinConfig from "./CruiseCabinConfig.jsx";
import CruiseDynamicSections from "./CruiseDynamicSections.jsx";


const AdminUpdateCruise = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [cruiseId, setCruiseId] = useState(null);

    // --- STATES MATCHING MODEL ---
    const [title, setTitle] = useState("");
    const [cruiseType, setCruiseType] = useState("Luxury cruise");
    const [duration, setDuration] = useState(2);
    const [isActive, setIsActive] = useState(true);
    const [price, setPrice] = useState(0);
    const [city, setCity] = useState("");
    const [departureTime, setDepartureTime] = useState(null);
    const [launchedOn, setLaunchedOn] = useState(null);

    // --- CABINS STATE ---
    const [cabins, setCabins] = useState([]); // Danh sách cabin ĐÃ CHỌN
    const [templates, setTemplates] = useState([]); // Danh sách cabin MẪU

    const [itinerary, setItinerary] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [additionalServices, setAdditionalServices] = useState([]);
    const [faq, setFaq] = useState([]);
    const [linkPhoto, setLinkPhoto] = useState("");
    const [photos, setPhotos] = useState([]);
    const [description, setDescription] = useState("");

    // Calendar
    const [calendarMode, setCalendarMode] = useState("PRICE");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [priceEvents, setPriceEvents] = useState("");
    const [daysChoosed, setDaysChoosed] = useState(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
    const [priceExtra, setPriceExtra] = useState([]);
    const [availabilityRules, setAvailabilityRules] = useState([]);

    const fetchTemplates = async () => {
        const res = await getCabinTemplatesApi();
        if (res.success) {
            setTemplates(res.data);
        }
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const initData = async () => {
            setFetching(true);
            try {
                await fetchTemplates();

                // 2. Fetch cruise Detail
                if (slug) {
                    const resCruise = await getCruiseDetailApi(slug);
                    if (resCruise.success) {
                        const data = resCruise.data;
                        setCruiseId(data._id);
                        setTitle(data.title);
                        setCruiseType(data.cruiseType);
                        setDuration(data.duration);
                        setPrice(data.price);
                        setIsActive(data.isActive);
                        setCity(data.city || "");
                        if(data.departureTime) setDepartureTime(moment(data.departureTime));
                        if(data.launchedOn) setLaunchedOn(moment(data.launchedOn));

                        // Map Existing Cabins with tempId for table handling
                        const mappedCabins = (data.cabins || []).map(c => ({
                            ...c,
                            tempId: c._id || Date.now() + Math.random() // Use existing ID or generate temp
                        }));
                        setCabins(mappedCabins);

                        setItinerary(data.itinerary || []);
                        setAmenities(data.amenities || []);
                        setAdditionalServices(data.additionalServices || []);
                        setFaq(data.faq || []);
                        setPhotos(data.photos || []);
                        setDescription(data.description || "");
                        setPriceExtra(data.priceExtra || []);
                        setAvailabilityRules(data.availabilityRules || []);
                    } else {
                        toast.error("cruise not found");
                        navigate("/dashboard-view-cruise");
                    }
                }
            } catch (error) {
                toast.error("Error fetching data");
                console.error(error);
            } finally {
                setFetching(false);
            }
        };
        initData();
    }, [slug, navigate]);

    const handleCabinsChange = (updatedCabins) => {
        setCabins(updatedCabins);
        if (updatedCabins.length > 0) {
            setPrice(Math.min(...updatedCabins.map(c => Number(c.pricePerNight))));
        } else {
            setPrice(0);
        }
    };

    const handleCreateTemplateRequest = async (cabinData) => {
        try {
            const res = await createCabinApi(cabinData);
            if (res.success) {
                return true;
            } else {
                toast.error(res.message);
                return false;
            }
        } catch (error) {
            toast.error("Failed to create template, ",error);
            return false;
        }
    };

    // --- HANDLERS: MEDIA ---
    const addPhotoByFile = async (ev) => {
        const files = ev.target.files; const data = new FormData();
        for (let i = 0; i < files.length; i++) data.append("photos", files[i]);
        const res = await uploadByFilesApi(data);
        if (res.success) setPhotos([...photos, ...res.data.map((item) => item.url)]);
    };
    const addPhotoByLink = (e) => { e.preventDefault(); uploadByLinkApi({ imageUrl: linkPhoto }).then((res) => { if (res.code === 200) { setPhotos([...photos, res.data.url]); setLinkPhoto(""); } }); };
    const removePhoto = (ev, filename) => { ev.preventDefault(); setPhotos(photos.filter((photo) => photo !== filename)); };

    // Calendar
    const baseEvents = useMemo(() => { if (!price) return []; const events = []; let current = moment().startOf('day'); const endRange = moment().add(1, "year"); while (current.isBefore(endRange)) { events.push({ start: current.toDate(), end: current.clone().endOf("day").toDate(), title: price, type: "BASE_PRICE", isBlocked: false }); current.add(1, "day"); } return events; }, [price]);
    const combinedEvents = useMemo(() => { const overrideEvents = priceExtra.map((p) => ({ start: new Date(p.startDate), end: new Date(p.endDate), title: p.price, type: "PRICE_OVERRIDE", isBlocked: false })); const blockEvents = availabilityRules.filter((r) => r.isBlocked).map((r) => ({ start: new Date(r.startDate), end: new Date(r.endDate), title: "Closed", type: "BLOCK", isBlocked: true })); const occupiedDates = new Set(); [...overrideEvents, ...blockEvents].forEach((e) => occupiedDates.add(moment(e.start).startOf("day").valueOf())); return [...baseEvents.filter((e) => !occupiedDates.has(moment(e.start).startOf("day").valueOf())), ...overrideEvents, ...blockEvents]; }, [baseEvents, priceExtra, availabilityRules]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (date) setOpenEndDate(true);
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
        setOpenEndDate(false);
    };
    const handleDayClick = (dayShort) => {
        const mapDay = { "Sun": "Sunday", "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday" };
        const fullDay = mapDay[dayShort];
        setDaysChoosed(prev => prev.includes(fullDay) ? prev.filter(d => d !== fullDay) : [...prev, fullDay]);
    };

    const handleApplyCalendar = () => {
        if (!startDate || !endDate) return toast.error("Select dates");
        if (calendarMode === "PRICE" && (!priceEvents || Number(priceEvents) <= 0)) return toast.error("Invalid price");

        const start = moment(startDate.toDate()).startOf('day');
        const end = moment(endDate.toDate()).endOf('day');
        let newPrices = [...priceExtra];
        let newRules = [...availabilityRules];

        while (start.isSameOrBefore(end, 'day')) {
            const dayName = start.format('dddd');
            if (daysChoosed.includes(dayName)) {
                const dateStartJS = start.toDate();
                const dateEndJS = start.clone().endOf('day').toDate();
                newPrices = newPrices.filter(p => !moment(p.startDate).isSame(start, 'day'));
                newRules = newRules.filter(r => !moment(r.startDate).isSame(start, 'day'));
                if (calendarMode === "PRICE") {
                    newPrices.push({ startDate: dateStartJS, endDate: dateEndJS, price: Number(priceEvents) });
                } else if (calendarMode === "BLOCK") {
                    newRules.push({ startDate: dateStartJS, endDate: dateEndJS, isBlocked: true, reason: "Manual Block" });
                }
            }
            start.add(1, 'days');
        }
        setPriceExtra(newPrices);
        setAvailabilityRules(newRules);
        toast.success(calendarMode === "OPEN" ? "Dates unblocked!" : "Calendar updated!");
        setPriceEvents(""); setStartDate(null); setEndDate(null);
    };

    const handleUpdateCruise = async () => {
        if (!title || !price || !city) return toast.error("Title, Price and City are required");
        if (!cruiseId) return toast.error("ID missing");
        if (cabins.length === 0) return toast.error("Please add at least one cabin");

        setLoading(true);

        // Clean cabins data before sending
        const finalCabins = cabins.map((cabin) => {
            const cabinCopy = { ...cabin };
            delete cabinCopy.tempId;
            return cabinCopy;
        });

        const dataCruise = {
            title, cruiseType, duration, price: Number(price),
            city,
            cabins: finalCabins,
            amenities: amenities.filter(a => a.group && a.items.length > 0),
            itinerary, additionalServices, faq, photos, description,
            departureTime: departureTime ? departureTime.toDate() : null,
            launchedOn: launchedOn ? launchedOn.toDate() : null,
            priceExtra, availabilityRules, isActive
        };

        try {
            const res = await updateCruiseApi(cruiseId, dataCruise);
            if (res.success) {
                toast.success("cruise Updated!");
                navigate("/dashboard-view-cruise");
            } else toast.error(res.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="rounded-md mx-5 top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 mb-8">
                <div className="max-w-full mx-auto flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 text-2xl flex items-center gap-2"><FaShip className="text-indigo-600"/> Update Cruise</h2>
                    <div className="flex items-center gap-4">
                        <Switch checked={isActive} onChange={setIsActive} checkedChildren="Active" unCheckedChildren="Inactive" className={isActive ? "bg-green-500" : "bg-gray-300"} />
                        <Button type="primary" onClick={handleUpdateCruise} loading={loading} className="bg-gray-900 h-10 px-6">Save Changes</Button>
                    </div>
                </div>
            </div>

            <div className="max-w-full mx-auto px-4 md:px-6 flex flex-col gap-6">

                {/* 1. BASIC INFO */}
                <CruiseBasicInfo
                    data={{ title, cruiseType, city, duration, price, departureTime, launchedOn }}
                    setData={(updater) => {
                        const newState = updater({ title, cruiseType, city, duration, price, departureTime, launchedOn });
                        setTitle(newState.title);
                        setCruiseType(newState.cruiseType);
                        setCity(newState.city);
                        setDuration(newState.duration);
                        setPrice(newState.price);
                        setDepartureTime(newState.departureTime);
                        setLaunchedOn(newState.launchedOn);
                    }}
                />

                {/* 2. CABIN CONFIGURATION */}
                <CruiseCabinConfig
                    cabins={cabins}
                    templates={templates}
                    onCabinsChange={handleCabinsChange}
                    onTemplateCreateRequest={handleCreateTemplateRequest}
                    onTemplateCreated={fetchTemplates}
                />

                {/* 3. DYNAMIC SECTIONS */}
                <CruiseDynamicSections
                    amenities={amenities}
                    setAmenities={setAmenities}
                    itinerary={itinerary}
                    setItinerary={setItinerary}
                    faq={faq}
                    setFaq={setFaq}
                    // Ensure both lines below are PLURAL (with an 's')
                    additionalServices={additionalServices}
                    setAdditionalServices={setAdditionalServices}
                />

                {/* 5. CALENDAR & PRICING (STYLE RESTORED) */}
                <div className="w-full bg-white border border-gray-100 shadow-sm rounded-2xl p-6 transition-shadow hover:shadow-md overflow-hidden">
                    <div className="flex mb-6 items-center gap-3 border-b border-gray-100 pb-3">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                        <h2 className="font-bold text-gray-800 text-lg">Calendar & Availability</h2>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-8">
                        <div className="flex-1">
                            <AdminCalendar events={combinedEvents} />
                        </div>
                        <div className="w-full xl:w-1/3 h-fit bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-indigo-500 rounded-full block"></span> Manage Calendar
                            </h3>

                            {/* UPDATED MODE SWITCHER */}
                            <div className="mb-6 p-1 bg-gray-100 rounded-xl flex">
                                <button onClick={() => setCalendarMode("PRICE")} className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${calendarMode === "PRICE" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                                    <FaDollarSign className="inline mb-0.5 mr-1" /> Price
                                </button>
                                <button onClick={() => setCalendarMode("BLOCK")} className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${calendarMode === "BLOCK" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                                    <FaBan className="inline mb-0.5 mr-1" /> Block
                                </button>
                                <button onClick={() => setCalendarMode("OPEN")} className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${calendarMode === "OPEN" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                                    <FaUnlock className="inline mb-0.5 mr-1" /> Open
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Date Range</label>
                                <div className="flex flex-col gap-3">
                                    <DatePicker className="w-full h-11 !bg-gray-50 !border-gray-200 rounded-xl" disabledDate={(c) => c && c < moment().endOf('day')} value={startDate} onChange={handleStartDateChange} placeholder="Start Date" format="DD/MM/YYYY" />
                                    <DatePicker className="w-full h-11 !bg-gray-50 !border-gray-200 rounded-xl" disabledDate={(c) => c && c < moment().endOf('day')} value={endDate} open={openEndDate} onChange={handleEndDateChange} onClick={() => setOpenEndDate(true)} placeholder="End Date" format="DD/MM/YYYY" />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Recur on Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => {
                                        const isSel = daysChoosed.includes(day === "Sun" ? "Sunday" : day === "Mon" ? "Monday" : day === "Tue" ? "Tuesday" : day === "Wed" ? "Wednesday" : day === "Thu" ? "Thursday" : day === "Fri" ? "Friday" : "Saturday");
                                        return (
                                            <div key={idx} onMouseDown={(e) => { e.preventDefault(); handleDayClick(day); }} className={`cursor-pointer w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-sm border ${isSel ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-200 scale-105" : "bg-white text-gray-500 hover:text-indigo-600 border-gray-200 hover:border-indigo-300"}`}>{day.charAt(0)}</div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mb-8">
                                {calendarMode === "PRICE" && (
                                    <div className="relative group">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Price per night</label>
                                        <InputNumber
                                            className="w-full !rounded-xl !bg-gray-50 !border-gray-200 hover:!border-indigo-500 focus-within:!border-indigo-500 focus-within:!ring-2 focus-within:!ring-indigo-500/20 shadow-sm transition-all duration-200"
                                            placeholder="0" value={priceEvents} onChange={(val) => setPriceEvents(val)} min={0}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                            style={{ width: '100%' }} controls={false} size="large"
                                        />
                                        <span className="absolute right-4 top-[38px] text-xs font-bold text-gray-400 pointer-events-none">VND</span>
                                    </div>
                                )}

                                {calendarMode === "BLOCK" && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center shadow-sm">
                                        <p className="text-red-600 text-sm font-semibold flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Selected dates will be closed</p>
                                    </div>
                                )}

                                {calendarMode === "OPEN" && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center shadow-sm">
                                        <p className="text-emerald-600 text-sm font-semibold flex items-center justify-center gap-2">
                                            <FaUnlock />
                                            Selected dates will be available
                                        </p>
                                        <p className="text-xs text-emerald-500 mt-1">
                                            Removes custom blocks & prices
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onMouseDown={(e) => { e.preventDefault(); handleApplyCalendar(); }}
                                className={`w-full py-3.5 text-white rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] 
                                ${calendarMode === "PRICE"
                                    ? "bg-gray-900 hover:bg-gray-800"
                                    : calendarMode === "BLOCK"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-emerald-500 hover:bg-emerald-600"
                                }`}
                            >
                                {calendarMode === "PRICE" ? "Apply Price" : calendarMode === "BLOCK" ? "Block Dates" : "Unblock / Open"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 7. MEDIA */}
                <Card title="Images & Description" className="shadow-sm rounded-2xl">
                    <div className="flex gap-2 mb-4">
                        <Input value={linkPhoto} onChange={e => setLinkPhoto(e.target.value)} placeholder="Image URL" />
                        <Button onClick={addPhotoByLink}>Add</Button>
                        <label className="cursor-pointer bg-gray-100 px-4 py-1 rounded border flex items-center hover:bg-gray-200"><input type="file" hidden multiple onChange={addPhotoByFile} />Upload</label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
                        {photos.map((p, idx) => (
                            <div key={idx} className="relative group h-24 border rounded overflow-hidden">
                                <img src={p} className="w-full h-full object-cover" alt="cruise" />
                                <button onClick={e => removePhoto(e, p)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">×</button>
                            </div>
                        ))}
                    </div>
                    <EditorTiny handleEditorChange={setDescription} description={description} />
                </Card>
            </div>
        </div>
    );
};

export default AdminUpdateCruise;
