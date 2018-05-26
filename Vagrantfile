Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  # configuration of ansible
  config.vm.provision :ansible do |ansible|
    	ansible.playbook = "provision/provision.yml"
  end
end