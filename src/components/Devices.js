import React from 'react';
import { ArcSlider, Box, Checkbox, Flex, Table, Txt } from 'rendition';
import styled from 'styled-components';

const ControlContainer = styled(Box)`
  border-top-left-radius: 10px;
`;

const columns = [
  {
    field: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    field: 'active',
    label: 'State',
    sortable: true,
    render(value) {
      return (
        <Flex>
          <Checkbox toggle checked={value} onChange={console.log} mr={2} />
          <Txt ml={2}>{value ? 'On' : 'Off'}</Txt>
        </Flex>
      );
    },
  },
  {
    field: 'brightness',
    label: 'Brightness',
    sortable: true,
    render(value) {
      return `${value}%`;
    },
  },
];

export class Devices extends React.Component {
  constructor(props) {
    super(props);
    this.state = { devices: [] };
  }

  componentDidMount() {
    this.getDevices();
  }

  getDevices() {
    fetch('http://localhost:3000/api/v1/device')
      .then(response => response.json())
      .then(response => {
        this.setState({ devices: response.data });
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <Flex flex='1' mt={4}>
        <Box flex='3' pl={3}>
          <Table
            flex='1'
            columns={columns}
            data={this.state.devices}
            rowKey='id'
            //onRowClick={console.log}
          />
        </Box>

        <ControlContainer flex='2' ml={3} bg='secondary.main'>
          <ArcSlider width='450px' mx='auto'>
            <Txt color='white'>Brightness</Txt>
          </ArcSlider>
        </ControlContainer>
      </Flex>
    );
  }
}
