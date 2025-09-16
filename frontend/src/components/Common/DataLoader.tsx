import {
  Center,
  Loader,
  Text,
} from "@mantine/core"

const DataLoader = () => (
  <Center className="min-h-[60vh]">
    <Loader mr="md" />
    <Text>Loading...</Text>
  </Center>
)

export default DataLoader