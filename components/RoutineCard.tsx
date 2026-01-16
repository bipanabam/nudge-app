import { Routine, RoutineStatus, getActionLabel, getRoutineIcon } from '@/types/routine';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
interface RoutineCardProps {
  routine: Routine;
  status: RoutineStatus;
  onComplete: (id: string) => void;
  onStartLaundry?: (id: string) => void;
}

const StatusIcon = ({status, statusBadgeClass}: any) => {
  if (status==='idle'){
    return (
    <View className={`px-2 py-2 rounded-lg flex-row items-center gap-1 ${statusBadgeClass}`}>
      <Feather name='clock' size={18} color={''} />
      <Text className='font-semibold text-sm capitalize'>{status}</Text>
    </View>
    )
  } 
  if (status==='overdue') {
    return (
      <View className={`px-2 py-2 rounded-lg flex-row items-center gap-1 ${statusBadgeClass}`}>
        <Feather name='alert-circle' size={18} color={'red'} />
        <Text className='font-semibold text-sm capitalize'>{status}</Text>
      </View>
    )
  }
  return (
    <View className={`px-2 py-2 rounded-lg flex-row items-center gap-1 ${statusBadgeClass}`}>
      <Feather name='check' size={18} color={'#2F3A36'} />
      <Text className='font-semibold text-sm capitalize'>{status}</Text>
    </View>
  )
}

export const RoutineCard = ({ routine, status, onComplete, onStartLaundry }: RoutineCardProps) => {
  const [pressed, setPressed] = useState(false);
  const isLaundryIdle = routine.type === 'laundry' && status !== 'active';
  const isLaundryReady = routine.type === 'laundry' && status === 'active';

  const handleComplete = () => onComplete(routine.id);
  const handleStartLaundry = () => onStartLaundry?.(routine.id);

  // Map routine types to their full class names
  const routineStyles = {
    laundry: { bg: 'bg-laundry-bg', fg: 'text-laundry-fg', button: 'bg-laundry' },
    plant: { bg: 'bg-plant-bg', fg: 'text-plant-fg', button: 'bg-plant' },
    pet: { bg: 'bg-pet-bg', fg: 'text-pet-fg', button: 'bg-pet' },
    trash: { bg: 'bg-trash-bg', fg: 'text-trash-fg', button: 'bg-trash' },
  };

  const styles = routineStyles[routine.type];

  const statusBadgeClass = {
    overdue: 'bg-status-overdue text-red-600',
    done: 'bg-status-done text-green-600',
    active: 'bg-status-active text-blue-600',
    idle: 'bg-muted text-mutedForeground'
  }[status];

  return (
    <Pressable
      className={`rounded-xl p-5 mb-4 ${styles.bg}`}
      onPress={handleComplete}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ transform: [{ scale: pressed ? 0.97 : 1 }] }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center gap-3">
          <Text className={`text-3xl ${styles.fg}`}>{getRoutineIcon(routine.type)}</Text>
          <View>
            <Text className={`font-bold text-lg ${styles.fg}`}>{routine.name}</Text>
            <Text className="text-sm text-mutedForeground">
              {routine.lastCompletedAt ? 'Last done recently' : 'Never completed'}
            </Text>
          </View>
        </View>
        <View className='flex-row gap-2 items-center'>
          <StatusIcon status={status} statusBadgeClass={statusBadgeClass} />

          <View className='rounded-lg items-center p-3 bg-card'>
            <Feather name='more-vertical' size={20} color={'#2F3A36'} />
          </View>
        </View>

      </View>
      {/* Action */}
      {isLaundryIdle ? (
        <Pressable
          className={`${styles.button} flex flex-row justify-center rounded-xl py-4 items-center mt-2 gap-2`}
          onPress={handleStartLaundry}
        >
          <Feather name='check' color={'white'} size={20} />
          <Text className="font-bold text-white">
            Start Laundry ({routine.scheduleConfig.durationMinutes} min)
          </Text>
        </Pressable>
      ) : (
        <Pressable
          className={`${styles.button} flex flex-row justify-center rounded-xl py-4 items-center mt-2 gap-2`}
          onPress={handleComplete}
        >
          <Feather name='check' color={'white'} size={20} />
          <Text className="font-bold text-white">
            {isLaundryReady ? 'Laundry Done' : getActionLabel(routine.type)}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};