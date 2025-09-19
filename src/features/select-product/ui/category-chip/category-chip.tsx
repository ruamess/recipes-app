import { Button } from 'shared/ui/button'
import { Text } from 'shared/ui/text'

type Props = {
  label: string
  active?: boolean
  onPress?: () => void
}

export function CategoryChip({ label, active, onPress }: Props) {
  return (
    <Button variant={active ? 'default' : 'secondary'} onPress={onPress}>
      <Text>{label}</Text>
    </Button>
  )
}
