import { Card, Button, Row, Col, Input, Select, Collapse, InputNumber } from "antd";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { FaListUl, FaQuestionCircle, FaConciergeBell } from "react-icons/fa";

const { Panel } = Collapse;
const { TextArea } = Input;

// Destructure props with a default value for additionalServices to prevent "undefined" errors
const CruiseDynamicSections = ({
                                   amenities, setAmenities,
                                   itinerary, setItinerary,
                                   faq, setFaq,
                                   additionalServices = [], // <--- FIX 1: Default to empty array
                                   setAdditionalServices
                               }) => {

    // Amenities Handlers
    const handleAddAmenityGroup = () => setAmenities([...amenities, { group: "", items: [] }]);
    const handleRemoveAmenityGroup = (idx) => setAmenities(amenities.filter((_, i) => i !== idx));
    const handleAmenityGroupChange = (idx, val) => { const newAm = [...amenities]; newAm[idx].group = val; setAmenities(newAm); };
    const handleAmenityItemsChange = (idx, val) => { const newAm = [...amenities]; newAm[idx].items = val; setAmenities(newAm); };

    // Itinerary Handlers
    const handleAddItineraryDay = () => setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "", meals: [] }]);
    const handleRemoveItineraryDay = (idx) => setItinerary(itinerary.filter((_, i) => i !== idx).map((item, i) => ({ ...item, day: i + 1 })));
    const handleItineraryChange = (idx, field, value) => { const newIt = [...itinerary]; newIt[idx][field] = value; setItinerary(newIt); };

    // FAQ Handlers
    const handleAddFaq = () => setFaq([...faq, { question: "", answer: "" }]);
    const handleFaqChange = (idx, field, val) => { const newF = [...faq]; newF[idx][field] = val; setFaq(newF); };
    const handleRemoveFaq = (idx) => setFaq(faq.filter((_, i) => i !== idx));

    // Additional Services Handlers
    const handleAddService = () => setAdditionalServices([...additionalServices, { name: "", price: 0 }]);

    // FIX 2: Correct State Update (Avoid direct mutation)
    const handleServiceChange = (idx, field, val) => {
        const newS = [...additionalServices];
        // Create a new object for the item being changed
        newS[idx] = { ...newS[idx], [field]: val };
        setAdditionalServices(newS);
    };

    const handleRemoveService = (idx) => setAdditionalServices(additionalServices.filter((_, i) => i !== idx));

    return (
        <>
            {/* AMENITIES */}
            <Card
                title={
                    <div className="flex items-center gap-2 text-gray-700">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><FaListUl size={16}/></div>
                        <span className="font-bold text-lg">Amenities</span>
                    </div>
                }
                extra={<Button type="dashed" onClick={handleAddAmenityGroup} icon={<IoAddCircleOutline className="text-lg"/>} className="text-indigo-600 border-indigo-200 hover:text-indigo-700 hover:border-indigo-400">Add Group</Button>}
                className="shadow-sm rounded-2xl border-gray-100"
                bodyStyle={{ padding: '20px', backgroundColor: '#f9fafb' }}
            >
                <div className="space-y-4">
                    {amenities.map((item, idx) => (
                        <div key={idx} className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:border-indigo-100">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <Button type="text" danger shape="circle" icon={<IoTrashOutline size={18} />} onClick={() => handleRemoveAmenityGroup(idx)} className="bg-red-50 hover:bg-red-100"/>
                            </div>
                            <Row gutter={[24, 24]}>
                                <Col span={24} md={8}>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Group Name</label>
                                    <Input placeholder="e.g. Dining, Wellness" value={item.group} onChange={e => handleAmenityGroupChange(idx, e.target.value)} className="font-semibold text-gray-700 !border-gray-200 focus:!border-indigo-500 !rounded-lg" size="large"/>
                                </Col>
                                <Col span={24} md={16}>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Included Items</label>
                                    <Select mode="tags" placeholder="Type item and press Enter..." value={item.items} onChange={v => handleAmenityItemsChange(idx, v)} className="w-full" size="large" style={{ borderRadius: '8px' }} tokenSeparators={[',']}/>
                                </Col>
                            </Row>
                        </div>
                    ))}
                    {amenities.length === 0 && <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">No amenities groups added yet.</div>}
                </div>
            </Card>

            {/* ITINERARY */}
            <Card
                title={<div className="flex items-center gap-2 text-gray-700"><span className="font-bold text-lg">Itinerary Schedule</span></div>}
                extra={<Button type="primary" onClick={handleAddItineraryDay} icon={<IoAddCircleOutline className="text-lg"/>} className="bg-gray-900 hover:!bg-gray-800 border-0 shadow-md">Add Day</Button>}
                className="shadow-sm rounded-2xl border-gray-100"
                bodyStyle={{ padding: '20px' }}
            >
                <div className="flex flex-col gap-3">
                    {itinerary.map((item, idx) => (
                        <Collapse key={idx} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden [&_.ant-collapse-header]:!items-center [&_.ant-collapse-content]:!border-t-gray-100" expandIconPosition="end">
                            <Panel
                                key="1"
                                header={
                                    <div className="flex items-center gap-4 py-1">
                                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex flex-col items-center justify-center border border-indigo-100">
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Day</span>
                                            <span className="text-lg font-bold leading-none">{item.day}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-700 text-base">{item.title || <span className="text-gray-400 italic">Untitled Day</span>}</h4>
                                            <p className="text-xs text-gray-400 m-0 truncate w-64">{item.description || "No description provided"}</p>
                                        </div>
                                    </div>
                                }
                                extra={<Button type="text" danger icon={<IoTrashOutline size={18} />} onClick={(e) => { e.stopPropagation(); handleRemoveItineraryDay(idx); }} className="hover:bg-red-50 rounded-full"/>}
                            >
                                <div className="pt-2">
                                    <Row gutter={[20, 20]}>
                                        <Col span={24} md={12}><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title</label><Input placeholder="e.g. Welcome on Board" value={item.title} onChange={e => handleItineraryChange(idx, 'title', e.target.value)} className="!rounded-lg"/></Col>
                                        <Col span={24} md={12}><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Included Meals</label><Select mode="tags" placeholder="e.g. Lunch, Dinner" value={item.meals} onChange={v => handleItineraryChange(idx, 'meals', v)} className="w-full" options={["Breakfast", "Brunch", "Lunch", "Dinner", "Light Snacks"].map(m => ({label: m, value: m}))}/></Col>
                                        <Col span={24}><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Activities Description</label><TextArea placeholder="Describe the activities for this day..." rows={3} value={item.description} onChange={e => handleItineraryChange(idx, 'description', e.target.value)} className="!rounded-lg !resize-none"/></Col>
                                    </Row>
                                </div>
                            </Panel>
                        </Collapse>
                    ))}
                    {itinerary.length === 0 && (
                        <div onClick={handleAddItineraryDay} className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all">
                            <IoAddCircleOutline size={32} /><span className="font-semibold mt-2">Start adding your itinerary</span>
                        </div>
                    )}
                </div>
            </Card>

            {/* EXTRAS & FAQ */}
            <Row gutter={24}>
                <Col span={24} lg={12}>
                    <Card
                        title={
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-lg font-bold text-gray-800">
                                    <FaConciergeBell className="text-blue-500"/> Additional Services
                                </span>
                                <Button size="small" onClick={handleAddService} icon={<IoAddCircleOutline />}>Add</Button>
                            </div>
                        }
                        className="shadow-sm rounded-2xl h-full"
                        bodyStyle={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}
                    >
                        <div className="space-y-3">
                            {/* FIX 3: Optional chaining checks */}
                            {additionalServices && additionalServices.length > 0 ? additionalServices.map((svc, idx) => (
                                <div key={idx} className="group relative flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm">
                                    <Input
                                        placeholder="Service Name"
                                        value={svc.name}
                                        onChange={e => handleServiceChange(idx, 'name', e.target.value)}
                                        className="flex-grow"
                                    />
                                    <InputNumber
                                        placeholder="Price"
                                        value={svc.price}
                                        onChange={v => handleServiceChange(idx, 'price', v)}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        className="w-32"
                                    />
                                    <Button
                                        danger
                                        type="text"
                                        shape="circle"
                                        icon={<IoTrashOutline />}
                                        onClick={() => handleRemoveService(idx)}
                                        className="opacity-50 group-hover:opacity-100"
                                    />
                                </div>
                            )) : (
                                <div className="text-center text-gray-400 py-6 italic text-sm">
                                    No optional services added.
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
                <Col span={24} lg={12}>
                    <Card
                        title={
                            <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-lg font-bold text-gray-800">
                        <FaQuestionCircle className="text-orange-500"/> FAQ
                    </span>
                                <Button size="small" onClick={handleAddFaq} icon={<IoAddCircleOutline />}>Add</Button>
                            </div>
                        }
                        className="shadow-sm rounded-2xl h-full"
                        bodyStyle={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}
                    >
                        <div className="space-y-4">
                            {faq.map((f, idx) => (
                                <div key={idx} className="group relative p-4 bg-gray-50 border border-gray-100 rounded-xl transition-all hover:bg-white hover:shadow-md hover:border-orange-100">

                                    <button
                                        onClick={() => handleRemoveFaq(idx)}
                                        className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <IoTrashOutline size={16} />
                                    </button>

                                    <div className="flex gap-3 mb-3">
                                        <div className="mt-2 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">Q</div>
                                        <Input.TextArea
                                            placeholder="Type the question here..."
                                            autoSize
                                            className="!bg-transparent !border-0 !border-b !border-gray-200 !rounded-none focus:!shadow-none focus:!border-orange-400 px-0 font-medium text-gray-700"
                                            value={f.question}
                                            onChange={e => handleFaqChange(idx, 'question', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="mt-2 w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">A</div>
                                        <Input.TextArea
                                            placeholder="Type the answer here..."
                                            autoSize={{ minRows: 2 }}
                                            className="!bg-white !border-gray-200 !rounded-lg text-gray-600 text-sm focus:!border-indigo-400"
                                            value={f.answer}
                                            onChange={e => handleFaqChange(idx, 'answer', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}

                            {faq.length === 0 && (
                                <div className="text-center text-gray-400 py-6 italic text-sm">
                                    No FAQs added. Add common questions to help customers.
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CruiseDynamicSections;
