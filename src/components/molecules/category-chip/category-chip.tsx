import { Button } from 'components/atoms/button'
import { Text } from 'components/atoms/text'

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
