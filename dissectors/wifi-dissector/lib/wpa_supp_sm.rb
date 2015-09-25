
$: << File.dirname(__FILE__)+"/../lib/"
require "state_dissector"

class WpaSuppSM < StateMachineizer
	attr_accessor :candidate_states

	@TAG = "wpa_suppplicant"
	@title_color = "#BBBBBB"
	@all_events = {
		:wpa_connection => [
			["EAPOL", "SUPP_PAE", "CONNECTING"],
			["EAPOL", "SUPP_BE", "IDLE"],
			["EAPOL", "SUPP_PAE", "AUTHENTICATING"],
			["EAPOL", "SUPP_BE", "SUCCESS"],
			["EAP", "EAP", "DISABLED"],
			["EAPOL", "SUPP_PAE", "AUTHENTICATED"],
			["EAPOL", "SUPP_BE", "IDLE"]],
		:wpa_connection_ => [
			["EAPOL", "SUPP_PAE", "CONNECTING"],
			["EAPOL", "SUPP_BE", "IDLE"],
			["EAPOL", "SUPP_PAE", "AUTHENTICATING"],
			["EAPOL", "SUPP_BE", "SUCCESS"],
			["EAPOL", "SUPP_BE", "IDLE"],
			["EAPOL", "SUPP_PAE", "AUTHENTICATED"],
			["EAP", "EAP", "DISABLED"]],
		# :wpa_almost_connection => [
		# 	["EAPOL", "SUPP_PAE", "CONNECTING"],
		# 	["EAPOL", "SUPP_BE", "IDLE"],
		# 	["EAPOL", "SUPP_PAE", "AUTHENTICATING"],
		# 	["EAPOL", "SUPP_BE", "SUCCESS"]],

		:eapol_init => [
			["EAPOL", "SUPP_PAE", "DISCONNECTED"],
			["EAPOL", "SUPP_BE", "INITIALIZE"]],
		# :eap_init => [
			# ["EAP", "EAP", "DISABLED"]],

		:eap_timeout => [
			["EAPOL", "SUPP_BE", "TIMEOUT"]],

		:eap_restart_auth => [
			["EAPOL", "SUPP_PAE", "CONNECTING"],
			["EAPOL", "SUPP_BE", "IDLE"],
			["EAPOL", "SUPP_PAE", "CONNECTING"],
			["EAPOL", "SUPP_PAE", "RESTART"],
			["EAP", "EAP", "INITIALIZE"],
			["EAP", "EAP", "IDLE"],
			["EAPOL", "SUPP_PAE", "AUTHENTICATING"]],

		:eap_start_auth => [
			["EAPOL", "SUPP_PAE", "CONNECTING"],
			["EAPOL", "SUPP_BE", "IDLE"],
			["EAP", "EAP", "INITIALIZE"],
			["EAP", "EAP", "IDLE"],
			["EAPOL", "SUPP_PAE", "RESTART"],
			["EAP", "EAP", "INITIALIZE"],
			["EAP", "EAP", "IDLE"],
			["EAPOL", "SUPP_PAE", "AUTHENTICATING"]],
		:eap_identity => [
			["EAPOL", "SUPP_BE", "REQUEST"],
			["EAP", "EAP", "RECEIVED"],
			["EAP", "EAP", "IDENTITY"],
			["EAP", "EAP", "SEND_RESPONSE"],
			["EAP", "EAP", "IDLE"],
			["EAPOL", "SUPP_BE", "RESPONSE"],
			["EAPOL", "SUPP_BE", "RECEIVE"]],
		:eap_get_method => [
			["EAPOL", "SUPP_BE", "REQUEST"],
			["EAP", "EAP", "RECEIVED"],
			["EAP", "EAP", "GET_METHOD"],
			["EAP", "EAP", "METHOD"],
			["EAP", "EAP", "SEND_RESPONSE"],
			["EAP", "EAP", "IDLE"],
			["EAPOL", "SUPP_BE", "RESPONSE"],
			["EAPOL", "SUPP_BE", "RECEIVE"]],
		:eap_method => [
			["EAPOL", "SUPP_BE", "REQUEST"],
			["EAP", "EAP", "RECEIVED"],
			["EAP", "EAP", "METHOD"],
			["EAP", "EAP", "SEND_RESPONSE"],
			["EAP", "EAP", "IDLE"],
			["EAPOL", "SUPP_BE", "RESPONSE"],
			["EAPOL", "SUPP_BE", "RECEIVE"]],
		:eap_success => [
			["EAPOL", "SUPP_BE", "REQUEST"],
			["EAP", "EAP", "RECEIVED"],
			["EAP", "EAP", "SUCCESS"],
			["EAPOL", "SUPP_BE", "RECEIVE"],
			["EAPOL", "SUPP_BE", "SUCCESS"],
			["EAPOL", "SUPP_BE", "IDLE"],
			["EAPOL", "SUPP_PAE", "AUTHENTICATED"]],

		:eap_failure => [
			["EAPOL", "SUPP_BE", "REQUEST"],
			["EAP", "EAP", "RECEIVED"],
			["EAP", "EAP", "FAILURE"],
			["EAPOL", "SUPP_PAE", "HELD"],
			["EAPOL", "SUPP_BE", "RECEIVE"],
			["EAPOL", "SUPP_BE", "FAIL"],
			["EAPOL", "SUPP_BE", "IDLE"]]
	}
	@color_events = {
		:wpa_connection => :blue,
		:wpa_connection_ => :blue,
		# :wpa_almost_connection => :yellow,
		:eapol_init => :green,
		# :eap_init => :green,
		:eap_timeout => :yellow,
		:eap_restart_auth => :blue,
		:eap_start_auth => :blue,
		:eap_identity => :magenta,
		:eap_get_method => :magenta,
		:eap_method => :magenta,
		:eap_success => :cyan,
		:wpa_supp_no_info => :white,
		:eap_failure => :yellow
	}

	# egrep -i 'invokeE.*: |(eap(ol)?).*entering.*state' 
	def parse_state line
		super(line) +
		line.match(/wpa_supplicant.*(EAP(OL)?): (EAP|SUPP_(BE|PAE|KEY_RX)) entering state ([_A-Z]+)/).captures.values_at(0, 2, 4)
	end

end
