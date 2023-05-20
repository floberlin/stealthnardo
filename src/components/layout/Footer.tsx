import { Box, Flex, Text } from '@chakra-ui/react'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { SITE_FOOTER, SOCIAL_GITHUB, SOCIAL_TWITTER } from 'utils/config'
import { LinkComponent } from './LinkComponent'

interface Props {
  className?: string
}

export function Footer(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex as="footer" className={className} flexDirection="column" justifyContent="center" alignItems="center" my={8}>
      <Text>{SITE_FOOTER}</Text>

      <Flex color="gray.500" gap={2} alignItems="center" mt={2}>
        <LinkComponent href={`https://twitter.com/floberlin_eth`}>
          <Flex alignItems="center">
            <FaTwitter />
            <Box ml={2}>Flo</Box>
          </Flex>
        </LinkComponent>
        &
        <LinkComponent href={`https://twitter.com/caruso33`}>
          <Flex alignItems="center">
            <FaTwitter />
            <Box ml={2}>Tobi</Box>
          </Flex>
        </LinkComponent>
      </Flex>
    </Flex>
  )
}
