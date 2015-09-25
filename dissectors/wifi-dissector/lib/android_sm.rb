
$: << File.dirname(__FILE__)+"/../lib/"
require "state_dissector"

class AndroidSM < StateMachineizer
	@TAG = "android_framework"
	@title_color = "#EAEAEA"
	@all_events = {	
		:default => [
			["Enter", "DefaultState"],
			["Enter", "InitialState"]],

		:connection => [
		    ["Exit", "DisconnectedState"],
		    ["Enter", "L2ConnectedState"],
	        ["Enter", "ObtainingIpState"],
	        ["Exit", "ObtainingIpState"],
	        ["Enter", "ConnectedState"]],
		:connected_refresh => [
			["Exit", "ConnectedState"],
			["Enter", "ConnectedState"]],

		:disconnection => [
	        ["Exit", "ConnectedState"],
		    ["Exit", "L2ConnectedState"],
		    ["Enter", "DisconnectedState"]],
		:disconnection_ing => [
	        ["Exit", "ConnectedState"],
		    ["Exit", "L2ConnectedState"],
		    ["Enter", "DisconnectingState"],
		    ["Exit", "DisconnectingState"],
		    ["Enter", "DisconnectedState"]],
		:disconnected_refresh => [
			["Exit", "DisconnectedState"],
			["Enter", "DisconnectedState"]],

		:turn_on_wifi => [
		    ["Exit", "InitialState"],
		    ["Enter", "SupplicantStartingState"],
		    ["Exit", "SupplicantStartingState"],
		    ["Enter", "SupplicantStartedState"],
		    ["Enter", "DriverStartedStateExt"],
		    ["Enter", "DriverStartedState"],
		    ["Enter", "ConnectModeState"],
		    ["Enter", "DisconnectedState"]],
		:turn_on_wifi_suppon => [
		    ["Exit", "ScanModeState"],
		    ["Enter", "ConnectModeState"],
		    ["Enter", "DisconnectedState"]],

		:turn_off_wifi_maintainsupp => [
		    ["Exit", "DisconnectedState"],
		    ["Exit", "ConnectModeState"],
		    ["Enter", "ScanModeState"]],
		:turn_off_wifi_stopsupp => [
		    ["Exit", "DisconnectedState"],
		    ["Exit", "ConnectModeState"],
		    ["Exit", "DriverStartedState"],
		    ["Exit", "DriverStartedStateExt"],
		    ["Enter", "WaitForP2pDisableState"],
		    ["Exit", "WaitForP2pDisableState"],
		    ["Exit", "SupplicantStartedState"],
		    ["Enter", "SupplicantStoppingState"],
		    ["Exit", "SupplicantStoppingState"],
		    ["Enter", "InitialState"]],

		:disconnection_and_turn_off => [
			["Exit", "ConnectedState"],
			["Exit", "L2ConnectedState"],
			["Exit", "ConnectModeState"],
			["Exit", "DriverStartedState"],
			["Exit", "DriverStartedStateExt"],
			["Enter", "WaitForP2pDisableState"],
			["Exit", "WaitForP2pDisableState"],
			["Exit", "SupplicantStartedState"],
			["Enter", "SupplicantStoppingState"],
			["Exit", "SupplicantStoppingState"],
			["Enter", "InitialState"]]
	}
	@color_events = {
		:default => :white,
		:connection => :blue,
		:disconnection => :yellow,
		:disconnection_ing => :yellow,
		:connected_refresh => :white,
		:disconnected_refresh => :white,
		:turn_on_wifi => :green,
		:turn_on_wifi_suppon => :green,
		:turn_off_wifi_stopsupp => :red,
		:turn_off_wifi_maintainsupp => :red,
		:disconnection_and_turn_off => :red,
		:android_no_info => :white
	}

	def parse_state line
		super(line) + 
		[line.match(/invoke(E.*)Methods/).captures.first, # action
		 line.match(/Methods: (.*State(Ext)?)/).captures.first] # state
	end

end
