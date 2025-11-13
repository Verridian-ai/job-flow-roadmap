import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addHours, setHours, setMinutes } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Calendar,
  Clock,
  Globe,
  User,
  Video,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  RefreshCcw,
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CoachAvailability {
  id: string;
  coachId: string;
  coachName: string;
  start: Date;
  end: Date;
  title: string;
  isAvailable: boolean;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

interface BookingData {
  coachId: string;
  coachName: string;
  sessionType: string;
  duration: number;
  start: Date;
  end: Date;
  notes: string;
  timezone: string;
}

export default function SessionBooking() {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [timezone, setTimezone] = useState('America/New_York');
  const [selectedCoach, setSelectedCoach] = useState('all');
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    sessionType: 'interview_prep',
    duration: 60,
    notes: '',
    timezone: 'America/New_York',
  });

  // Mock data - in real app, this would come from Convex
  const availableSlots: CoachAvailability[] = [
    {
      id: '1',
      coachId: 'coach1',
      coachName: 'Sarah Johnson',
      title: 'Available - Sarah Johnson',
      start: setMinutes(setHours(new Date(), 9), 0),
      end: setMinutes(setHours(new Date(), 10), 0),
      isAvailable: true,
    },
    {
      id: '2',
      coachId: 'coach1',
      coachName: 'Sarah Johnson',
      title: 'Available - Sarah Johnson',
      start: setMinutes(setHours(new Date(), 14), 0),
      end: setMinutes(setHours(new Date(), 15), 0),
      isAvailable: true,
    },
    {
      id: '3',
      coachId: 'coach2',
      coachName: 'Michael Chen',
      title: 'Available - Michael Chen',
      start: setMinutes(setHours(addHours(new Date(), 24), 10), 0),
      end: setMinutes(setHours(addHours(new Date(), 24), 11), 0),
      isAvailable: true,
    },
    {
      id: '4',
      coachId: 'coach2',
      coachName: 'Michael Chen',
      title: 'Booked - Client Session',
      start: setMinutes(setHours(new Date(), 11), 0),
      end: setMinutes(setHours(new Date(), 12), 0),
      isAvailable: false,
    },
  ];

  const coaches = [
    { id: 'coach1', name: 'Sarah Johnson', specialty: 'Interview Coaching' },
    { id: 'coach2', name: 'Michael Chen', specialty: 'Career Strategy' },
    { id: 'coach3', name: 'Emily Rodriguez', specialty: 'Resume Writing' },
  ];

  const sessionTypes = [
    { value: 'interview_prep', label: 'Interview Preparation', duration: 60 },
    { value: 'resume_review', label: 'Resume Review', duration: 45 },
    { value: 'career_strategy', label: 'Career Strategy', duration: 60 },
    { value: 'salary_negotiation', label: 'Salary Negotiation', duration: 45 },
    { value: 'promotion_coaching', label: 'Promotion Coaching', duration: 60 },
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  const filteredSlots = selectedCoach === 'all'
    ? availableSlots
    : availableSlots.filter(slot => slot.coachId === selectedCoach);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Only allow booking available slots
    const clickedSlot = filteredSlots.find(
      slot => slot.start.getTime() === start.getTime() && slot.isAvailable
    );

    if (clickedSlot) {
      setSelectedSlot({ start, end });
      setBookingData({
        ...bookingData,
        coachId: clickedSlot.coachId,
        coachName: clickedSlot.coachName,
        start,
        end,
      });
      setShowBookingModal(true);
    }
  };

  const handleSelectEvent = (event: CoachAvailability) => {
    if (event.isAvailable) {
      setSelectedSlot({ start: event.start, end: event.end });
      setBookingData({
        ...bookingData,
        coachId: event.coachId,
        coachName: event.coachName,
        start: event.start,
        end: event.end,
      });
      setShowBookingModal(true);
    }
  };

  const handleBookSession = () => {
    // In real app, this would call Convex mutation
    console.log('Booking session:', bookingData);
    alert('Session booked successfully! You will receive a confirmation email.');
    setShowBookingModal(false);
    setSelectedSlot(null);
    setBookingData({
      sessionType: 'interview_prep',
      duration: 60,
      notes: '',
      timezone: 'America/New_York',
    });
  };

  const handleAddToCalendar = (type: 'google' | 'outlook') => {
    if (!bookingData.start) return;

    const title = `Coaching Session: ${bookingData.sessionType?.replace('_', ' ')}`;
    const details = bookingData.notes || 'Coaching session';
    const location = 'Video Call';

    if (type === 'google') {
      const startTime = format(bookingData.start, "yyyyMMdd'T'HHmmss");
      const endTime = format(bookingData.end || addHours(bookingData.start, 1), "yyyyMMdd'T'HHmmss");
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
        location
      )}`;
      window.open(url, '_blank');
    } else {
      // Outlook calendar format
      const startTime = bookingData.start.toISOString();
      const endTime = (bookingData.end || addHours(bookingData.start, 1)).toISOString();
      const url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
        title
      )}&startdt=${startTime}&enddt=${endTime}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(
        location
      )}`;
      window.open(url, '_blank');
    }
  };

  const eventStyleGetter = (event: CoachAvailability) => {
    const style: React.CSSProperties = {
      backgroundColor: event.isAvailable ? '#eab308' : '#6b7280',
      borderRadius: '5px',
      opacity: event.isAvailable ? 0.9 : 0.5,
      color: event.isAvailable ? '#1f2937' : 'white',
      border: 'none',
      display: 'block',
    };
    return { style };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Calendar className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Session Booking</h1>
                    <p className="text-gray-400">Schedule coaching sessions with available coaches</p>
                  </div>
                </div>
                <button
                  onClick={() => setDate(new Date())}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Today
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <select
                        value={selectedCoach}
                        onChange={(e) => setSelectedCoach(e.target.value)}
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="all">All Coaches</option>
                        {coaches.map((coach) => (
                          <option key={coach.id} value={coach.id}>
                            {coach.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setView('day')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          view === 'day' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Day
                      </button>
                      <button
                        onClick={() => setView('week')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          view === 'week' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Week
                      </button>
                      <button
                        onClick={() => setView('month')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          view === 'month' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Month
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4" style={{ height: '600px' }}>
                    <BigCalendar
                      localizer={localizer}
                      events={filteredSlots}
                      startAccessor="start"
                      endAccessor="end"
                      view={view}
                      onView={setView}
                      date={date}
                      onNavigate={setDate}
                      onSelectSlot={handleSelectSlot}
                      onSelectEvent={handleSelectEvent}
                      eventPropGetter={eventStyleGetter}
                      selectable
                      step={30}
                      showMultiDayTimes
                      defaultView="week"
                      views={['month', 'week', 'day']}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold">Quick Info</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-gray-300">Available Slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-500 rounded"></div>
                      <span className="text-gray-300">Booked</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Click on an available slot to book a session
                  </p>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold">Available Coaches</h3>
                  </div>
                  <div className="space-y-3">
                    {coaches.map((coach) => (
                      <div
                        key={coach.id}
                        className="p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                        onClick={() => setSelectedCoach(coach.id)}
                      >
                        <p className="font-medium text-sm">{coach.name}</p>
                        <p className="text-xs text-gray-400">{coach.specialty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-blue-500">Time Zone Support</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    All times are shown in your selected time zone. Coach availability automatically adjusts.
                  </p>
                </div>

                <div className="bg-green-500/20 border border-green-500 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCcw className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-green-500">Recurring Sessions</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Book regular check-ins by setting up recurring sessions during booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Book Coaching Session</h2>
                  <p className="text-sm text-gray-400">with {bookingData.coachName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-gray-400">Selected Time</p>
                    <p className="font-semibold">
                      {bookingData.start && format(bookingData.start, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-gray-400">
                      {bookingData.start && format(bookingData.start, 'h:mm a')} -{' '}
                      {bookingData.end && format(bookingData.end, 'h:mm a')} ({timezone})
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Type
                </label>
                <select
                  value={bookingData.sessionType}
                  onChange={(e) => {
                    const selectedType = sessionTypes.find(t => t.value === e.target.value);
                    setBookingData({
                      ...bookingData,
                      sessionType: e.target.value,
                      duration: selectedType?.duration || 60,
                    });
                  }}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {sessionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <div className="flex gap-2">
                  {[30, 45, 60, 90].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setBookingData({ ...bookingData, duration })}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                        bookingData.duration === duration
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  placeholder="What would you like to focus on in this session?"
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-yellow-500 bg-gray-900 border-gray-700 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-300">Set up as recurring session</span>
                </label>
              </div>

              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Video className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-blue-500">Meeting Details</h3>
                </div>
                <p className="text-sm text-gray-300">
                  A video call link will be sent to your email after booking. You can also add this session to
                  your calendar.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAddToCalendar('google')}
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Add to Google Calendar
                </button>
                <button
                  onClick={() => handleAddToCalendar('outlook')}
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Add to Outlook
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBookSession}
                className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
