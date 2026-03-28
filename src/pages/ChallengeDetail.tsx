import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Star, MapPin, Search, Camera,
  MousePointerClick, Timer, CheckCircle2, AlertTriangle, ImagePlus, Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useChallenges } from '../hooks/useChallenges';
import { useProgressContext } from '../hooks/useProgressContext';
import { getTheme } from '../themes';
import type { ChallengeType, CompletionRating } from '../types';
import StarRating from '../components/challenges/StarRating';
import ClueRevealer from '../components/challenges/ClueRevealer';
import { deletePhotoProof, getPhotoProof, savePhotoProof, type PhotoProofRecord } from '../lib/photoProofStore';
import { getMissingChallengePrerequisites, isChallengeUnlocked } from '../lib/unlocks';

const typeIcons: Record<ChallengeType, LucideIcon> = {
  find: Search,
  photo: Camera,
  interact: MousePointerClick,
  timed: Timer,
};

const difficultyColors: Record<string, string> = {
  easy: '#16A34A',
  medium: '#D97706',
  hard: '#DC2626',
};

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const challenges = useChallenges();
  const {
    getProgress,
    markCompleted,
    revealHint,
    markInProgress,
    verifyLocation,
    confirmPhoto,
  } = useProgressContext();

  const challenge = challenges.find((c) => c.id === id);
  if (!challenge) {
    return (
      <div className="flex-1 flex items-center justify-center pb-24">
        <p className="text-slate-500">Challenge not found.</p>
      </div>
    );
  }

  const theme = getTheme(challenge.theme);
  const progress = getProgress(challenge.id);
  const TypeIcon = typeIcons[challenge.type];
  const isCompleted = progress.status === 'completed';
  const requiresLocation = challenge.verification?.location ?? false;
  const requiresPhoto = challenge.verification?.photo ?? challenge.photoRequired;
  const missingPrerequisites = getMissingChallengePrerequisites(challenge, getProgress);
  const unlocked = isChallengeUnlocked(challenge, getProgress);

  return (
    <div className="flex-1 pb-24 animate-fade-in">
      {/* Themed header */}
      <div
        className="relative px-4 pt-4 pb-6"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        }}
      >
        {/* Radial decoration */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.4) 0%, transparent 50%)',
          }}
        />

        <div className="relative">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center
                       backdrop-blur-sm mb-4 active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          {/* Title area */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <TypeIcon size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white leading-tight">
                {challenge.title}
              </h1>
              <p className="text-sm text-white/80 mt-1">{theme.name}</p>
            </div>
          </div>

          {/* Meta badges */}
          <div className="flex gap-2 mt-4">
            <MetaBadge
              icon={<Star size={12} />}
              label={`${challenge.points} pts`}
            />
            <MetaBadge
              icon={<Clock size={12} />}
              label={challenge.estimatedTime}
            />
            <MetaBadge
              icon={<MapPin size={12} />}
              label={challenge.difficulty}
              color={difficultyColors[challenge.difficulty]}
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="px-4 -mt-3">
        {/* Description card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {challenge.availability?.availabilityNote && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4 flex gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Heads up</p>
              <p className="text-sm text-amber-900 mt-1">
                {challenge.availability.availabilityNote}
              </p>
            </div>
          </div>
        )}

        {/* Current progress */}
        {isCompleted && (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Challenge Completed!</p>
              <StarRating stars={progress.stars} color={theme.primary} size={16} />
            </div>
          </div>
        )}

        {!unlocked && (
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 mb-4">
            <p className="text-sm font-semibold text-slate-700">Challenge locked</p>
            <p className="text-sm text-slate-500 mt-1">
              Complete these first: {missingPrerequisites.join(', ')}
            </p>
          </div>
        )}

        {/* Clue system */}
        <h2 className="text-base font-semibold text-slate-800 mb-3">Clues</h2>
        <ClueRevealer
          hint={challenge.hint}
          clues={challenge.clues}
          hintsUsed={progress.hintsUsed}
          onRevealHint={() => revealHint(challenge.id)}
          themeColor={theme.primary}
        />

        {/* Complete button (if not already completed) */}
        {!isCompleted && unlocked && (
          <CompleteSection
            challengeId={challenge.id}
            maxPoints={challenge.points}
            hintsUsed={progress.hintsUsed}
            themeColor={theme.primary}
            challengeLat={challenge.coordinates.lat}
            challengeLng={challenge.coordinates.lng}
            searchRadius={challenge.searchRadius}
            requiresLocation={requiresLocation}
            requiresPhoto={requiresPhoto}
            locationVerified={Boolean(progress.verification?.locationVerifiedAt)}
            photoVerified={Boolean(progress.verification?.photoConfirmedAt)}
            onVerifyLocation={() => verifyLocation(challenge.id)}
            onConfirmPhoto={(confirmed) => confirmPhoto(challenge.id, confirmed)}
            onComplete={(stars, points) => markCompleted(challenge.id, stars, points)}
            onStart={() => markInProgress(challenge.id)}
          />
        )}
      </div>
    </div>
  );
}

/** Small white pill badge for the header */
function MetaBadge({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <span
      className="flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 capitalize"
      style={{
        backgroundColor: color ? `${color}20` : 'rgba(255,255,255,0.2)',
        color: color ?? '#fff',
      }}
    >
      {icon}
      {label}
    </span>
  );
}

/** The bottom section where users pick stars and complete */
function CompleteSection({
  challengeId,
  maxPoints,
  hintsUsed,
  themeColor,
  challengeLat,
  challengeLng,
  searchRadius,
  requiresLocation,
  requiresPhoto,
  locationVerified,
  photoVerified,
  onVerifyLocation,
  onConfirmPhoto,
  onComplete,
  onStart,
}: {
  challengeId: string;
  maxPoints: number;
  hintsUsed: number;
  themeColor: string;
  challengeLat: number;
  challengeLng: number;
  searchRadius: number;
  requiresLocation: boolean;
  requiresPhoto: boolean;
  locationVerified: boolean;
  photoVerified: boolean;
  onVerifyLocation: () => void;
  onConfirmPhoto: (confirmed: boolean) => void;
  onComplete: (stars: CompletionRating, points: number) => void;
  onStart: () => void;
}) {
  const [selectedStars, setSelectedStars] = useState<CompletionRating>(0);
  const [showSelector, setShowSelector] = useState(false);
  const [photoProof, setPhotoProof] = useState<PhotoProofRecord | null>(null);
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [photoMessage, setPhotoMessage] = useState('');
  const [locationState, setLocationState] = useState<'idle' | 'checking' | 'verified' | 'outside' | 'error'>(
    locationVerified ? 'verified' : 'idle',
  );
  const [locationMessage, setLocationMessage] = useState(
    locationVerified ? 'Location already verified for this challenge.' : '',
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deduct 5 points per hint used
  const pointsEarned = Math.max(0, maxPoints - hintsUsed * 5);
  const canComplete = selectedStars > 0 && (!requiresLocation || locationVerified) && (!requiresPhoto || photoVerified);

  useEffect(() => {
    getPhotoProof(challengeId)
      .then((proof) => {
        setPhotoProof(proof);
        if (proof && !photoVerified) {
          onConfirmPhoto(true);
        }
      })
      .catch(() => {
        setPhotoProof(null);
      });
  }, [challengeId, onConfirmPhoto, photoVerified]);

  const handleLocationCheck = () => {
    if (!navigator.geolocation) {
      setLocationState('error');
      setLocationMessage('This device does not support location verification.');
      return;
    }

    setLocationState('checking');
    setLocationMessage('Checking your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = getDistanceMeters(
          position.coords.latitude,
          position.coords.longitude,
          challengeLat,
          challengeLng,
        );

        if (distance <= searchRadius) {
          onVerifyLocation();
          setLocationState('verified');
          setLocationMessage(`Verified. You are about ${Math.round(distance)}m from the target.`);
          return;
        }

        setLocationState('outside');
        setLocationMessage(
          `You are about ${Math.round(distance)}m away. Move within ${searchRadius}m to verify.`,
        );
      },
      (error) => {
        setLocationState('error');
        setLocationMessage(getLocationErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  };

  const handleProofCapture = async (file: File | null) => {
    if (!file) return;

    setPhotoStatus('saving');
    setPhotoMessage('Saving proof photo...');

    try {
      const proof = await savePhotoProof(challengeId, file);
      setPhotoProof(proof);
      onConfirmPhoto(true);
      setPhotoStatus('idle');
      setPhotoMessage('Proof photo saved on this device.');
    } catch {
      setPhotoStatus('error');
      setPhotoMessage('Unable to save the photo on this device.');
    }
  };

  const handleDeleteProof = async () => {
    try {
      await deletePhotoProof(challengeId);
      setPhotoProof(null);
      onConfirmPhoto(false);
      setPhotoMessage('Proof photo removed.');
      setPhotoStatus('idle');
    } catch {
      setPhotoStatus('error');
      setPhotoMessage('Unable to remove the saved photo.');
    }
  };

  if (!showSelector) {
    return (
      <button
        onClick={() => {
          setShowSelector(true);
          onStart();
        }}
        className="w-full mt-6 py-4 rounded-xl text-white font-semibold text-base
                   active:scale-[0.98] transition-transform"
        style={{ backgroundColor: themeColor }}
      >
        Verify And Complete
      </button>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <p className="text-sm font-medium text-slate-800 mb-3 text-center">
        How did you do?
      </p>

      {(requiresLocation || requiresPhoto) && (
        <div className="mb-4 space-y-3">
          {requiresLocation && (
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Location check</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Be within {searchRadius} meters of the challenge marker to unlock completion.
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                    locationVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {locationVerified ? 'Verified' : 'Required'}
                </span>
              </div>

              <button
                onClick={handleLocationCheck}
                disabled={locationState === 'checking'}
                className="mt-3 w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: themeColor }}
              >
                {locationState === 'checking' ? 'Checking location...' : 'Verify I Am Here'}
              </button>

              {locationMessage && (
                <p
                  className={`mt-2 text-xs ${
                    locationState === 'verified'
                      ? 'text-emerald-600'
                      : locationState === 'outside' || locationState === 'error'
                        ? 'text-amber-700'
                        : 'text-slate-500'
                  }`}
                >
                  {locationMessage}
                </p>
              )}
            </div>
          )}

          {requiresPhoto && (
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Photo proof</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Capture or upload a photo from the challenge location before completing it.
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                    photoVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {photoVerified ? 'Saved' : 'Required'}
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  void handleProofCapture(file);
                  event.currentTarget.value = '';
                }}
              />

              {photoProof ? (
                <div className="mt-3">
                  <img
                    src={photoProof.dataUrl}
                    alt="Challenge proof"
                    className="w-full rounded-xl border border-slate-200 object-cover max-h-64"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <ImagePlus size={14} />
                      Retake Photo
                    </button>
                    <button
                      onClick={() => {
                        void handleDeleteProof();
                      }}
                      className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoStatus === 'saving'}
                  className="mt-3 w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColor }}
                >
                  <Camera size={14} />
                  {photoStatus === 'saving' ? 'Saving photo...' : 'Capture Proof Photo'}
                </button>
              )}

              {photoMessage && (
                <p
                  className={`mt-2 text-xs ${
                    photoStatus === 'error' ? 'text-amber-700' : 'text-slate-500'
                  }`}
                >
                  {photoMessage}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Star selector */}
      <div className="flex justify-center gap-3 mb-4">
        {([1, 2, 3] as CompletionRating[]).map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStars(s)}
            className="p-2 rounded-lg transition-all active:scale-95"
            style={{
              backgroundColor: selectedStars >= s ? `${themeColor}15` : '#f8fafc',
            }}
          >
            <Star
              size={28}
              fill={selectedStars >= s ? themeColor : 'none'}
              color={selectedStars >= s ? themeColor : '#CBD5E1'}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 text-center mb-4">
        You'll earn <strong>{pointsEarned} points</strong>
        {hintsUsed > 0 && ` (−${hintsUsed * 5} for ${hintsUsed} hint${hintsUsed > 1 ? 's' : ''})`}
      </p>

      <button
        onClick={() => {
          if (canComplete) onComplete(selectedStars, pointsEarned);
        }}
        disabled={!canComplete}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm
                   active:scale-[0.98] transition-all disabled:opacity-40"
        style={{ backgroundColor: themeColor }}
      >
        {!selectedStars
          ? 'Select your rating'
          : !locationVerified && requiresLocation
            ? 'Verify your location first'
            : !photoVerified && requiresPhoto
              ? 'Confirm your photo first'
              : 'Complete Challenge!'}
      </button>

    </div>
  );
}

function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusMeters = 6371000;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}

function getLocationErrorMessage(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location permission was denied. Allow access and try again.';
    case error.POSITION_UNAVAILABLE:
      return 'Your location is unavailable right now. Try again in a clearer area.';
    case error.TIMEOUT:
      return 'Location lookup timed out. Try again.';
    default:
      return 'Unable to verify location on this device.';
  }
}
