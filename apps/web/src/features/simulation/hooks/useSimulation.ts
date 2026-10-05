import { useState, useEffect, useCallback, useRef } from 'react';
import {
  createSimulation,
  fetchSimulation,
  fetchSimulationSteps,
} from '../../../services/api/simulations';
import {
  IgnitionPoint,
  SimulationJob,
  SimulationDetail,
  SimulationStepProperties,
} from '../../../types/domain';
import { GeoJSONFeatureCollection, MultiPolygonGeometry } from '../../../types/geo';

export function useSimulation(regionId: string) {
  const [ignitionPoint, setIgnitionPoint] = useState<IgnitionPoint | null>(null);
  const [durationHours, setDurationHours] = useState<number>(6);
  const [stepMinutes, setStepMinutes] = useState<number>(60);
  const [activeJob, setActiveJob] = useState<SimulationJob | null>(null);
  const [simulationDetail, setSimulationDetail] = useState<SimulationDetail | null>(null);
  const [stepsData, setStepsData] = useState<
    GeoJSONFeatureCollection<MultiPolygonGeometry, SimulationStepProperties> | null
  >(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const playbackTimerRef = useRef<number | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      return;
    }

    const totalSteps = stepsData?.features?.length || 0;
    if (totalSteps <= 1) {
      setIsPlaying(false);
      return;
    }

    playbackTimerRef.current = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return 0; // Loop or stop
        }
        return prev + 1;
      });
    }, 1500);

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, stepsData]);

  // Submit new simulation
  const handleStartSimulation = async (name: string = 'Operational Spread Run') => {
    if (!ignitionPoint) {
      setError('Please select an ignition point on the map or enter coordinates.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const job = await createSimulation({
        region_id: regionId,
        name,
        ignition_points: [ignitionPoint],
        max_duration_hours: durationHours,
        temporal_step_minutes: stepMinutes,
      });
      setActiveJob(job);

      // Fetch simulation details and initial steps
      const [detail, steps] = await Promise.all([
        fetchSimulation(job.simulation_id).catch(() => null),
        fetchSimulationSteps(job.simulation_id).catch(() => null),
      ]);

      if (detail) setSimulationDetail(detail);
      if (steps) {
        setStepsData(steps);
        setCurrentStepIndex(0);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Simulation submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearIgnition = useCallback(() => {
    setIgnitionPoint(null);
  }, []);

  const handleStepForward = useCallback(() => {
    const totalSteps = stepsData?.features?.length || 0;
    setCurrentStepIndex((prev) => Math.min(prev + 1, Math.max(totalSteps - 1, 0)));
  }, [stepsData]);

  const handleStepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    ignitionPoint,
    setIgnitionPoint,
    durationHours,
    setDurationHours,
    stepMinutes,
    setStepMinutes,
    activeJob,
    simulationDetail,
    stepsData,
    currentStepIndex,
    setCurrentStepIndex,
    isPlaying,
    setIsPlaying,
    isSubmitting,
    error,
    startSimulation: handleStartSimulation,
    clearIgnition: handleClearIgnition,
    stepForward: handleStepForward,
    stepBackward: handleStepBackward,
  };
}
