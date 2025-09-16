import { Alert, Container } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const DataError = ({ message = "Failed to load data" }) => (
	<Container>
		<Alert icon={<IconAlertCircle />} title="Error" color="red">
			{message}
		</Alert>
	</Container>
);

export default DataError;
