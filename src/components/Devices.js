import React from 'react';
import { ArcSlider, Box, Checkbox, Flex, Table, Txt, Heading } from 'rendition';
import styled from 'styled-components';

const ControlContainer = styled(Box)`
  border-top-left-radius: 10px;
`;

const columns = [
  {
    field: 'name',
    label: 'Room',
    sortable: true,
  },
  {
    field: 'active',
    label: 'State',
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
    render(value) {
      return `${Math.round(value)}%`;
    },
  },
];

export class Devices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: null,
    };

    this.onBrightnessUpdated = value => {
      console.log(value);
    };
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

  getSelectedRow = selectedRows => {
    if (selectedRows.length > 1) {
      selectedRows.shift();
    }
    this.setState({ selectedDevice: selectedRows[0] });
  };

  updateBrightness = brightness => {
    const selectedDevice = this.state.selectedDevice;
    selectedDevice.brightness = brightness * 100;
    this.setState({ selectedDevice });
  };

  render() {
    return (
      <Flex flex='1' mt={4}>
        <Box flex='3'>
          <Table
            flex='1'
            columns={columns}
            data={this.state.devices}
            rowKey='id'
            onCheck={this.getSelectedRow}
          />
        </Box>

        <ControlContainer flex='2' ml={3} bg='secondary.main'>
          <ArcSlider
            width='450px'
            mx='auto'
            value={
              this.state.selectedDevice
                ? this.state.selectedDevice.brightness / 100
                : 0
            }
            onValueChange={this.updateBrightness}
          >
            <Heading.h2>
              {this.state.selectedDevice
                ? Math.round(this.state.selectedDevice.brightness)
                : 0}
              %
            </Heading.h2>
            <Txt color='white'>Brightness</Txt>
          </ArcSlider>
        </ControlContainer>
      </Flex>
    );
  }
}
