import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { tokens } from '../theme';
import {
  SAMPLE_TIMETABLE,
  DAYS,
  TRAVEL_BUFFER_MIN,
  findGapsForDay,
  occupancyForGap,
  recommendWorkouts,
  formatTime,
} from '../data/gapFinderData';

const OCCUPANCY_CONFIG = {
  Low: {
    label: 'Low',
    color: '#22C55E',
    icon: TrendingDownIcon,
    description: 'Plenty of free equipment',
  },
  Medium: {
    label: 'Medium',
    color: '#F59E0B',
    icon: TrendingFlatIcon,
    description: 'May wait for popular machines',
  },
  High: {
    label: 'High',
    color: '#EF4444',
    icon: TrendingUpIcon,
    description: 'Expect crowding — plan for waits',
  },
};

/**
 * Smart Gap Finder screen.
 * Flow: view timetable → find available gap → view predicted gym occupancy →
 * view recommended workout → plan workout → confirmation.
 *
 * All data is fixture data for this prototype; no live York University systems
 * are contacted, and a student's timetable is never sent anywhere or shown to
 * other users (it lives only in this component's state).
 */
export default function GapFinder() {
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [planGap, setPlanGap] = useState(null);
  const [planWorkout, setPlanWorkout] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const dayClasses = useMemo(
    () => SAMPLE_TIMETABLE.filter((c) => c.day === selectedDay),
    [selectedDay]
  );

  const gaps = useMemo(() => findGapsForDay(dayClasses), [dayClasses]);

  function handleSelectWorkout(gap, workout) {
    setPlanGap(gap);
    setPlanWorkout(workout);
  }

  function handleConfirmPlan() {
    setConfirmation({ gap: planGap, workout: planWorkout, day: selectedDay });
    setPlanGap(null);
    setPlanWorkout(null);
  }

  function handleClosePlan() {
    setPlanGap(null);
    setPlanWorkout(null);
  }

  function handleCloseConfirmation() {
    setConfirmation(null);
  }

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', px: 2, py: 3 }}>
      {/* Heading */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <ScheduleIcon sx={{ color: 'primary.light', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>
          Smart Gap Finder
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Find free time between classes, check predicted gym occupancy, and plan a
        workout that fits your day.
      </Typography>

      {/* Day selector */}
      <ToggleButtonGroup
        value={selectedDay}
        exclusive
        onChange={(_, v) => v && setSelectedDay(v)}
        size="small"
        aria-label="Select day"
        sx={{
          mb: 3,
          flexWrap: 'wrap',
          gap: 0.5,
          '& .MuiToggleButtonGroup-grouped': {
            border: `1px solid ${tokens.borderViolet}`,
            borderRadius: '10px',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#8E8EA0',
            '&.Mui-selected': {
              backgroundColor: tokens.accentDim15,
              color: tokens.violetBright,
              borderColor: tokens.accentBorder40,
            },
            '&:not(:first-of-type)': {
              borderRadius: '10px',
              borderLeft: `1px solid ${tokens.borderViolet}`,
            },
            '&:first-of-type': { borderRadius: '10px' },
            '&:last-of-type': { borderRadius: '10px' },
          },
        }}
      >
        {DAYS.map((day) => (
          <ToggleButton key={day} value={day} id={`gap-day-${day}`}>
            {day.slice(0, 3)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Timetable */}
      <Typography variant="h6" sx={{ fontSize: '0.85rem', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <EventIcon sx={{ fontSize: 18, color: 'primary.light' }} />
        {selectedDay} Timetable
      </Typography>

      {dayClasses.length === 0 ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              No classes scheduled for {selectedDay}. The whole day is available —
              enjoy an open session at Tait McKenzie.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {dayClasses.map((cls) => (
            <Card key={cls.id} sx={{ border: `1px solid ${tokens.borderViolet}` }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 6,
                    alignSelf: 'stretch',
                    borderRadius: '3px',
                    backgroundColor: tokens.violet,
                    boxShadow: `0 0 12px ${tokens.glowViolet}`,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', lineHeight: 1.2 }}>
                    {cls.course}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                    {cls.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.72rem', mt: 0.25 }}>
                    {cls.location}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary' }}>
                    {formatTime(cls.start)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                    to {formatTime(cls.end)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Divider sx={{ mb: 3, borderColor: tokens.borderViolet }} />

      {/* Available gaps */}
      <Typography variant="h6" sx={{ fontSize: '0.85rem', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.light' }} />
        Available Gaps
      </Typography>

      {gaps.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              No suitable gaps of at least {TRAVEL_BUFFER_MIN + 15} minutes were
              found between your classes on {selectedDay}. Try another day.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {gaps.map((gap) => (
            <GapCard
              key={gap.id}
              gap={gap}
              onSelectWorkout={handleSelectWorkout}
            />
          ))}
        </Box>
      )}

      {/* Plan workout modal */}
      <Dialog
        open={!!planGap}
        onClose={handleClosePlan}
        maxWidth="xs"
        fullWidth
        id="plan-workout-dialog"
      >
        {planGap && planWorkout && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: '"Space Grotesk", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: '0.95rem',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FitnessCenterIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                Plan Workout
              </Box>
              <IconButton size="small" onClick={handleClosePlan} aria-label="Close">
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {selectedDay}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontSize: '1rem', mt: 0.25 }}>
                  {planWorkout.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    icon={<TimerIcon sx={{ fontSize: 14 }} />}
                    label={`${planWorkout.minutes} min`}
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      backgroundColor: tokens.accentDim12,
                      color: tokens.violetBright,
                      border: `1px solid ${tokens.borderViolet}`,
                    }}
                  />
                  <Chip
                    size="small"
                    label={planWorkout.type}
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      backgroundColor: tokens.accentDim12,
                      color: tokens.violetBright,
                      border: `1px solid ${tokens.borderViolet}`,
                    }}
                  />
                  <Chip
                    size="small"
                    label={planWorkout.level}
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      backgroundColor: tokens.accentDim12,
                      color: tokens.violetBright,
                      border: `1px solid ${tokens.borderViolet}`,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2, p: 1.5, borderRadius: 1.5, backgroundColor: tokens.accentDim08, border: `1px solid ${tokens.borderViolet}` }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                  Gap
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {formatTime(planGap.start)} – {formatTime(planGap.end)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                  After {planGap.afterClass.course} · Gym occupancy {occupancyForGap(planGap)}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Exercises
              </Typography>
              <List dense disablePadding>
                {planWorkout.exercises.map((ex, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      py: 0.5,
                      '&::before': {
                        content: '"•"',
                        color: 'primary.light',
                        mr: 1.5,
                        fontSize: '1rem',
                        lineHeight: 1,
                      },
                    }}
                  >
                    <ListItemText
                      primary={ex}
                      primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.82rem' } }}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.72rem' }}>
                Includes {TRAVEL_BUFFER_MIN} min to reach the gym and change.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={handleClosePlan} variant="outlined">
                Back
              </Button>
              <Button
                onClick={handleConfirmPlan}
                variant="contained"
                id="confirm-plan-button"
                startIcon={<CheckCircleIcon />}
              >
                Plan Workout
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Confirmation modal */}
      <Dialog
        open={!!confirmation}
        onClose={handleCloseConfirmation}
        maxWidth="xs"
        fullWidth
        id="plan-confirmation-dialog"
      >
        {confirmation && (
          <>
            <DialogContent
              sx={{
                textAlign: 'center',
                py: 4,
                px: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 52,
                  color: '#22C55E',
                  filter: 'drop-shadow(0 0 12px rgba(34,197,94,0.5))',
                }}
              />
              <Typography variant="h5" sx={{ fontSize: '1.1rem' }}>
                Workout Planned
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're set for {confirmation.day}.
              </Typography>

              <Box sx={{ width: '100%', mt: 1, p: 2, borderRadius: 1.5, backgroundColor: tokens.accentDim08, border: `1px solid ${tokens.borderViolet}` }}>
                <Typography variant="subtitle1" sx={{ fontSize: '0.95rem' }}>
                  {confirmation.workout.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', mt: 0.5, fontWeight: 600 }}>
                  {formatTime(confirmation.gap.start)} – {formatTime(confirmation.gap.end)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={`${confirmation.workout.minutes} min`}
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      backgroundColor: tokens.accentDim12,
                      color: tokens.violetBright,
                      border: `1px solid ${tokens.borderViolet}`,
                    }}
                  />
                  <Chip
                    size="small"
                    label={`${confirmation.workout.type}`}
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      backgroundColor: tokens.accentDim12,
                      color: tokens.violetBright,
                      border: `1px solid ${tokens.borderViolet}`,
                    }}
                  />
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                Tait McKenzie Centre · {formatTime(confirmation.gap.start)} sharp
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button onClick={handleCloseConfirmation} variant="contained" id="confirmation-done-button">
                Done
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

/**
 * Card representing one available gap: time window, occupancy indicator,
 * and recommended workouts that fit. Each workout has a Plan Workout button.
 */
function GapCard({ gap, onSelectWorkout }) {
  const occupancy = occupancyForGap(gap);
  const occConfig = OCCUPANCY_CONFIG[occupancy];
  const OccIcon = occConfig.icon;
  const workouts = recommendWorkouts(gap);

  return (
    <Card id={gap.id}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Gap time window */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ color: 'primary.light', fontSize: 20 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', lineHeight: 1.2 }}>
                {formatTime(gap.start)} – {formatTime(gap.end)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                {gap.duration} min gap · {gap.usableMinutes} min usable
              </Typography>
            </Box>
          </Box>

          {/* Occupancy indicator */}
          <Chip
            icon={<GroupIcon sx={{ fontSize: 15 }} />}
            label={occConfig.label}
            size="small"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              backgroundColor: `${occConfig.color}22`,
              color: occConfig.color,
              border: `1px solid ${occConfig.color}66`,
              '& .MuiChip-icon': { color: occConfig.color },
            }}
          />
        </Box>

        {/* Class context */}
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
          Between{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {gap.afterClass.course}
          </Box>
          {' '}and{' '}
          {gap.beforeClass ? (
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {gap.beforeClass.course}
            </Box>
          ) : (
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
              end of day
            </Box>
          )}
        </Typography>

        {/* Occupancy description with icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <OccIcon sx={{ fontSize: 16, color: occConfig.color }} />
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: occConfig.color, fontWeight: 500 }}>
            {occConfig.description}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: tokens.borderViolet, my: 0.25 }} />

        {/* Recommended workouts */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
            Recommended Workouts
          </Typography>
          {workouts.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
              No workouts fit in this gap.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {workouts.map((w) => (
                <Box
                  key={w.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    p: 1.25,
                    borderRadius: 1.5,
                    backgroundColor: tokens.accentDim08,
                    border: `1px solid ${tokens.borderViolet}`,
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                      borderColor: tokens.accentBorder40,
                      backgroundColor: tokens.accentDim12,
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', fontWeight: 600 }}>
                      {w.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.75, mt: 0.25, flexWrap: 'wrap' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {w.minutes} min · {w.type}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                    onClick={() => onSelectWorkout(gap, w)}
                    id={`plan-${w.id}`}
                    sx={{ flexShrink: 0, fontSize: '0.7rem' }}
                  >
                    Plan
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
