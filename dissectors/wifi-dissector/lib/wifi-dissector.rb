require 'colorize'

$: << File.dirname(__FILE__)
require 'android_sm'
require "wpa_supp_sm"

# "Ocra" is a ruby gem that generates a .exe; 
#   so, stop script here if it is being called from ocra
exit if Object.const_defined? :Ocra 

@result = []
asm = AndroidSM.new
wssm = WpaSuppSM.new

run = true
line = nil
while (line = $stdin.gets)
	partial_result = []

	line = line.chomp unless line.nil?

	case line
	when /WifiStateMachine.*invokee.*methods: .*state/i
		partial_result = asm.process(line)
		asm.draw_event(partial_result) unless partial_result.empty? #temp.
		@result += partial_result
	when /wpa_supplicant.*(EAP(OL)?): (EAP|SUPP_(BE|PAE|KEY_RX)) entering state ([_A-Z]+)/
		partial_result = wssm.process(line)
		unless partial_result.empty?
			wssm.draw_event(partial_result, "  ")
		end
		@result += partial_result
	end

end
