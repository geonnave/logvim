require "test/unit"

$: << File.dirname(__FILE__)+"/../lib/"
require "wpa_supp_sm"

class MachineizerTest < Test::Unit::TestCase

	@@lines_connection = [
		"07-16 11:34:38.908  8810  8810 D wpa_supplicant: EAPOL: SUPP_PAE entering state CONNECTING",
		"07-16 11:34:38.908  8810  8810 D wpa_supplicant: EAPOL: SUPP_BE entering state IDLE",
		"07-16 11:34:38.919  8810  8810 D wpa_supplicant: EAPOL: SUPP_PAE entering state AUTHENTICATING",
		"07-16 11:34:38.919  8810  8810 D wpa_supplicant: EAPOL: SUPP_BE entering state SUCCESS",
		"07-16 11:34:38.919  8810  8810 D wpa_supplicant: EAP: EAP entering state DISABLED",
		"07-16 11:34:38.919  8810  8810 D wpa_supplicant: EAPOL: SUPP_PAE entering state AUTHENTICATED",
		"07-16 11:34:38.919  8810  8810 D wpa_supplicant: EAPOL: SUPP_BE entering state IDLE"]

	def test_line_parser
		wssm = WpaSuppSM.new
		assert_equal(
			["07-16 11:34:38.908", "EAPOL", "SUPP_PAE", "CONNECTING"],
			wssm.parse_state(@@lines_connection[0]))
		assert_equal(
			["07-16 11:34:38.919", "EAPOL", "SUPP_BE", "SUCCESS"],
			wssm.parse_state(@@lines_connection[3]))
		assert_equal(
			["07-16 11:34:38.919", "EAPOL", "SUPP_BE", "IDLE"],
			wssm.parse_state(@@lines_connection[6]))
	end

	def test_state_appending
		wssm = WpaSuppSM.new

		wssm.append_state_when_matches ["07-16 11:34:38.908", "EAPOL", "SUPP_PAE", "CONNECTING"]
		assert_equal(1, wssm.candidate_states[:wpa_connection].length)
		assert_equal(1, wssm.candidate_states[:eap_start_auth].length)

		wssm.append_state_when_matches ["07-16 11:34:38.908", "EAPOL", "SUPP_BE", "IDLE"]
		assert_equal(2, wssm.candidate_states[:wpa_connection].length)
		assert_equal(2, wssm.candidate_states[:eap_start_auth].length)

		wssm.append_state_when_matches ["07-16 11:34:38.919", "EAPOL", "SUPP_PAE", "AUTHENTICATING"]
		assert_equal(3, wssm.candidate_states[:wpa_connection].length)
		assert_equal(0, wssm.candidate_states[:eap_start_auth].length)
	end
end
