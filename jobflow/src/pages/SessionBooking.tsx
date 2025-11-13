import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';

export default function SessionBooking() {
  const { coachId } = useParams<{ coachId: string }>();
  const navigate = useNavigate();

  const coachData = useQuery(api.coaches.getWithUser, { id: coachId as Id<"coaches"> });
  const existingSessions = useQuery(api.sessions.listByCoach, { coachId: coachId as Id<"coaches"> });
  const createSession = useMutation(api.sessions.create);
  const createPayment = useMutation(api.payments.create);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<30 | 60 | 90>(60);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Calendar navigation
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    return days;
  }, [currentMonth, currentYear]);

  // Get available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!coachData?.coach.availability || !selectedDate) return [];

    const dayOfWeek = selectedDate.getDay();
    const availabilityForDay = coachData.coach.availability.find(
      (slot) => slot.dayOfWeek === dayOfWeek
    );

    if (!availabilityForDay) return [];

    // Generate time slots based on availability
    const slots: string[] = [];
    const startHour = parseInt(availabilityForDay.startTime.split(':')[0]);
    const endHour = parseInt(availabilityForDay.endTime.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // Filter out already booked slots
    const bookedSlots = new Set(
      existingSessions
        ?.filter((session) => {
          const sessionDate = new Date(session.scheduledTime);
          return (
            sessionDate.getDate() === selectedDate.getDate() &&
            sessionDate.getMonth() === selectedDate.getMonth() &&
            sessionDate.getFullYear() === selectedDate.getFullYear() &&
            session.status === 'scheduled'
          );
        })
        .map((session) => {
          const date = new Date(session.scheduledTime);
          return `${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;
        }) || []
    );

    return slots.filter((slot) => !bookedSlots.has(slot));
  }, [coachData, selectedDate, existingSessions]);

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTimeSlot || !coachData) return;

    setIsProcessing(true);

    try {
      // Combine date and time
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      // Calculate price
      const hourlyRate = coachData.coach.hourlyRate;
      const durationHours = duration / 60;
      const totalAmount = hourlyRate * durationHours;

      // Create payment first (this would integrate with Stripe)
      const paymentId = await createPayment({
        amount: totalAmount * 100, // Convert to cents
        currency: 'usd',
        type: 'session',
      });

      // Create session
      const sessionId = await createSession({
        coachId: coachId as Id<"coaches">,
        scheduledTime: scheduledDateTime.getTime(),
        duration,
        notes: notes || undefined,
      });

      // Update payment with session ID
      // In a real app, this would be handled by Stripe webhook
      // For now, we'll just mark the booking as complete

      setBookingComplete(true);

      // Redirect after a delay
      setTimeout(() => {
        navigate('/sessions');
      }, 3000);
    } catch (error) {
      console.error('Failed to book session:', error);
      alert('Failed to book session. Please try again.');
      setIsProcessing(false);
    }
  };

  const calculatePrice = () => {
    if (!coachData) return 0;
    const hourlyRate = coachData.coach.hourlyRate;
    const durationHours = duration / 60;
    return hourlyRate * durationHours;
  };

  if (!coachData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto text-center py-16">
              <p className="text-gray-400">Loading booking details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-2xl mx-auto text-center py-16">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-gray-300 mb-6">
                Your session with {coachData.user.name} has been successfully booked.
              </p>
              <p className="text-gray-400 mb-8">
                You'll receive a confirmation email with session details and meeting link.
              </p>
              <button
                onClick={() => navigate('/sessions')}
                className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                View My Sessions
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { coach, user } = coachData;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <button
              onClick={() => navigate(`/coaches/${coachId}`)}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Profile
            </button>

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Book a Session</h1>
              <p className="text-gray-400">Schedule a coaching session with {user.name}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar and Time Selection */}
              <div className="lg:col-span-2 space-y-6">
                {/* Calendar */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-yellow-500" />
                      Select a Date
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-gray-700 rounded transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-lg font-medium px-4">
                        {selectedDate.toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-gray-700 rounded transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, index) => {
                      if (!day) {
                        return <div key={`empty-${index}`} />;
                      }

                      const isToday = day.toDateString() === new Date().toDateString();
                      const isSelected = day.toDateString() === selectedDate.toDateString();
                      const isPast = day < today;
                      const hasAvailability = coach.availability.some(
                        (slot) => slot.dayOfWeek === day.getDay()
                      );

                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => !isPast && hasAvailability && setSelectedDate(day)}
                          disabled={isPast || !hasAvailability}
                          className={`
                            aspect-square p-2 rounded-lg text-sm font-medium transition
                            ${isSelected ? 'bg-yellow-500 text-gray-900' : ''}
                            ${
                              !isSelected && isToday
                                ? 'border-2 border-yellow-500 text-white'
                                : ''
                            }
                            ${
                              !isSelected && !isToday && !isPast && hasAvailability
                                ? 'hover:bg-gray-700 text-white'
                                : ''
                            }
                            ${
                              isPast || !hasAvailability
                                ? 'text-gray-600 cursor-not-allowed'
                                : ''
                            }
                          `}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      Available Time Slots
                    </h2>
                    {availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3">
                        {availableTimeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`
                              px-4 py-3 rounded-lg font-medium transition
                              ${
                                selectedTimeSlot === slot
                                  ? 'bg-yellow-500 text-gray-900'
                                  : 'bg-gray-700 text-white hover:bg-gray-600'
                              }
                            `}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No available slots for this date</p>
                        <p className="text-gray-500 text-sm mt-1">
                          Please select another date
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Booking Summary */}
              <div className="space-y-6">
                {/* Coach Info */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold text-gray-900">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {coach.specialty.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="font-semibold mb-4">Session Details</h3>

                  {/* Duration */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[30, 60, 90].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setDuration(mins as 30 | 60 | 90)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition
                            ${
                              duration === mins
                                ? 'bg-yellow-500 text-gray-900'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                            }
                          `}
                        >
                          {mins} min
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Session Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any topics or questions you'd like to discuss..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                    />
                  </div>

                  {/* Price */}
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Hourly Rate</span>
                      <span className="font-medium">${coach.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Duration</span>
                      <span className="font-medium">{duration} minutes</span>
                    </div>
                    <div className="flex items-center justify-between text-xl font-bold pt-2 border-t border-gray-700 mt-2">
                      <span>Total</span>
                      <span className="text-yellow-500">${calculatePrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBookSession}
                  disabled={!selectedDate || !selectedTimeSlot || isProcessing}
                  className={`
                    w-full px-6 py-4 rounded-lg font-semibold transition inline-flex items-center justify-center gap-2
                    ${
                      selectedDate && selectedTimeSlot && !isProcessing
                        ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <CreditCard className="w-5 h-5" />
                  {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You'll receive a confirmation email with meeting details after payment is
                  processed.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
